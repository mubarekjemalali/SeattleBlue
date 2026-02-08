package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.domain.VehicleType;
import com.seattleblue.booking.dto.AssignDriverRequestDto;
import com.seattleblue.booking.dto.AssignDriverResponseDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.repository.DriverRepository;
import com.seattleblue.booking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AdminAssignDriverService {

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;
    private final EmailService emailService;

    /**
     * Assign a driver to a booking.
     * This is a transactional operation:
     *  - validates booking/driver
     *  - updates booking (driver + status)
     *  - sends emails
     */
    @Transactional
    public AssignDriverResponseDto assignDriver(Long bookingId, AssignDriverRequestDto request) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Prevent assignment for terminal states
        if (booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.CANCELLED_BY_CUSTOMER
                || booking.getStatus() == BookingStatus.CANCELLED_BY_DISPATCHER) {
            throw new ResponseStatusException(BAD_REQUEST, "Cannot assign driver to a completed/cancelled booking");
        }

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Driver not found"));

        // Driver must be enabled (feature requirement: enable/disable drivers)
        if (!driver.isEnabled()) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver is disabled and cannot be assigned");
        }

        // Vehicle type must match booking selection
        VehicleType bookingType = booking.getSelectedVehicleType();
        VehicleType driverType = driver.getVehicle() != null ? driver.getVehicle().getVehicleType() : null;

        if (bookingType == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is missing selected vehicle type");
        }

        if (driverType == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver is missing vehicle type");
        }

        if (driverType != bookingType) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver vehicle type does not match booking vehicle type");
        }

        // Assign driver and update status
        booking.setDriver(driver);
        booking.setStatus(BookingStatus.ASSIGNED);

        // Save changes
        bookingRepository.save(booking);

        // Emails:
        // 1) notify driver
        emailService.sendDriverAssignedEmail(driver, booking);

        // 2) notify customer
        emailService.sendCustomerDriverAssignedEmail(driver, booking);

        return AssignDriverResponseDto.builder()
                .bookingId(booking.getId())
                .publicToken(booking.getPublicToken())
                .status(booking.getStatus())
                .driverId(driver.getId())
                .driverName(driver.getFullName())
                .driverVehicleType(driverType)
                .pickupTime(booking.getPickupTime())
                .pickupAddress(booking.getPickupAddress())
                .dropoffAddress(booking.getDropoffAddress())
                .build();
    }
}

