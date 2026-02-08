package com.seattleblue.booking.service;

import com.seattleblue.booking.domain.*;
import com.seattleblue.booking.dto.BookingCancelResponseDTO;
import com.seattleblue.booking.dto.BookingRequestDTO;
import com.seattleblue.booking.dto.BookingResponseDTO;
import com.seattleblue.booking.dto.BookingStatusResponseDTO;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.repository.FixedRouteRateRepository;
import com.seattleblue.booking.repository.FixedRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final CustomerService customerService;
    private final BookingRepository bookingRepository;
    private final FixedRouteRepository fixedRouteRepository;
    private final FixedRouteRateRepository fixedRouteRateRepository;
    private final EmailService emailService;

    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

        // 1. Find or create customer
        Customer customer = customerService.findOrCreateCustomer(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getPhoneNumber(),
                dto.getEmail()
        );

        // 2. Create new booking entity
        Booking booking = new Booking();
        booking.setCustomer(customer);

        // Set location info
        booking.setPickupAddress(dto.getPickupAddress());
        booking.setPickupLat(dto.getPickupLat());
        booking.setPickupLng(dto.getPickupLng());

        booking.setDropoffAddress(dto.getDropoffAddress());
        booking.setDropoffLat(dto.getDropoffLat());
        booking.setDropoffLng(dto.getDropoffLng());

        booking.setPickupTime(dto.getPickupTime());

        // 3. Customer snapshots
        booking.setCustomerFirstName(customer.getFirstName() != null ? customer.getFirstName() : "");
        booking.setCustomerLastName(customer.getLastName() != null ? customer.getLastName() : "");

        booking.setCustomerPhoneNumber(customer.getPhoneNumber());
        booking.setCustomerEmail(customer.getEmail());

        // 4. Fixed route pricing logic
        if (dto.getFixedRouteId() != null && dto.getVehicleType() != null) {

            FixedRoute route = fixedRouteRepository.findById(dto.getFixedRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid fixed route"));

            FixedRouteRate rate = fixedRouteRateRepository
                    .findByRouteAndVehicleType(route, dto.getVehicleType())
                    .orElseThrow(() -> new IllegalArgumentException("No pricing found"));

            booking.setFixedRoute(route);
            booking.setSelectedVehicleType(dto.getVehicleType());
            booking.setFixedRoutePrice(rate.getPrice());
        }

        // 5. Generate public token
        booking.setPublicToken(UUID.randomUUID().toString().replace("-", ""));

        // 6. Save booking
        booking = bookingRepository.save(booking);

        // 7. TODO: Send emails to customer + admin
        emailService.sendCustomerBookingCreatedEmail(booking);
        emailService.sendAdminNewBookingEmail(booking);

        // 8. Prepare response
        BookingResponseDTO res = new BookingResponseDTO();
        res.setBookingId(booking.getId());
        res.setPublicToken(booking.getPublicToken());
        res.setStatus(booking.getStatus());
        res.setPickupAddress(booking.getPickupAddress());
        res.setDropoffAddress(booking.getDropoffAddress());
        res.setPickupTime(booking.getPickupTime());
        res.setFixedRouteId(dto.getFixedRouteId());
        res.setVehicleType(dto.getVehicleType());
        res.setFixedRoutePrice(booking.getFixedRoutePrice());

        return res;
    }

    public BookingStatusResponseDTO getStatusByPublicToken(String token) {
        Booking booking = bookingRepository.findByPublicToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid tracking token"));

        BookingStatusResponseDTO dto = new BookingStatusResponseDTO();
        dto.setBookingId(booking.getId());
        dto.setStatus(booking.getStatus());
        dto.setPickupAddress(booking.getPickupAddress());
        dto.setDropoffAddress(booking.getDropoffAddress());
        dto.setPickupTime(booking.getPickupTime());

        // Driver assigned?
        if (booking.getDriver() != null) {
            Driver d = booking.getDriver();
            dto.setDriverName(d.getFirstName() + " " + d.getLastName());
            dto.setDriverVehicleType(d.getVehicle().getVehicleType());
        }

        return dto;
    }

    public BookingCancelResponseDTO cancelByPublicToken(String token, String reason) {

        Booking booking = bookingRepository.findByPublicToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid tracking token"));

        // Only allow cancellation in certain states
        if (booking.getStatus() == BookingStatus.COMPLETED ||
                booking.getStatus() == BookingStatus.CANCELLED_BY_CUSTOMER ||
                booking.getStatus() == BookingStatus.CANCELLED_BY_DISPATCHER) {

            throw new IllegalStateException("Booking cannot be cancelled");
        }

        // Update status
        booking.setStatus(BookingStatus.CANCELLED_BY_CUSTOMER);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);

        bookingRepository.save(booking);

        boolean driverWasAssigned = booking.getDriver() != null;

        // Always notify dispatcher/admin
        emailService.sendAdminBookingCancelledEmail(booking);

        if (driverWasAssigned) {
            // Notify the assigned driver as well
            emailService.sendDriverBookingCancelledEmail(booking.getDriver(), booking);
        }

// TODO: Send cancellation confirmation to the customer
//        emailService.sendCustomerBookingCanelledEmail(booking);

        BookingCancelResponseDTO dto = new BookingCancelResponseDTO();
        dto.setBookingId(booking.getId());
        dto.setStatus(booking.getStatus());
        dto.setCancelledAt(booking.getCancelledAt());

        return dto;
    }


}
