package com.seattleblue.booking.service;

import com.seattleblue.booking.domain.*;
import com.seattleblue.booking.dto.BookingCancelResponseDTO;
import com.seattleblue.booking.dto.BookingRequestDTO;
import com.seattleblue.booking.dto.BookingResponseDTO;
import com.seattleblue.booking.dto.BookingStatusResponseDTO;
import com.seattleblue.booking.mapper.BookingMapper;
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
    private final BookingMapper bookingMapper;

    public BookingResponseDTO createBooking(BookingRequestDTO dto) {

        // 1. Find or create customer
        Customer customer = customerService.findOrCreateCustomer(
                dto.getFirstName(),
                dto.getLastName(),
                dto.getPhoneNumber(),
                dto.getEmail()
        );

        // 2. Create new booking entity
        Booking booking = bookingMapper.toBooking(dto);
        booking.setCustomer(customer);

        // 3. Customer snapshots
        booking.setCustomerFirstName(customer.getFirstName() != null ? customer.getFirstName() : "");
        booking.setCustomerLastName(customer.getLastName() != null ? customer.getLastName() : "");

        booking.setCustomerPhoneNumber(customer.getPhoneNumber());
        booking.setCustomerEmail(customer.getEmail());

        booking.setSelectedVehicleType(dto.getVehicleType());

        // 4. Fixed route pricing logic
        if (dto.getFixedRouteId() != null && dto.getVehicleType() != null) {

            FixedRoute route = fixedRouteRepository.findById(dto.getFixedRouteId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid fixed route"));

            FixedRouteRate rate = fixedRouteRateRepository
                    .findByFixedRouteAndVehicleType(route, dto.getVehicleType())
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
        return bookingMapper.toBookingResponse(booking);
    }

    public BookingStatusResponseDTO getStatusByPublicToken(String token) {
        Booking booking = bookingRepository.findByPublicToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid tracking token"));

        return bookingMapper.toBookingStatus(booking);
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

        return bookingMapper.toBookingCancelResponse(booking);
    }


}
