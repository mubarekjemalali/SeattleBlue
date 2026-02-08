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
public class AdminReassignDriverService {

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;
    private final EmailService emailService;

    @Transactional
    public AssignDriverResponseDto reassignDriver(Long bookingId, AssignDriverRequestDto request) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Only allow reassignment for ASSIGNED bookings (keeps workflow clean)
        if (booking.getStatus() != BookingStatus.ASSIGNED) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking must be ASSIGNED to reassign driver");
        }

        Driver oldDriver = booking.getDriver();
        if (oldDriver == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking has no driver assigned. Use assign-driver workflow.");
        }

        Driver newDriver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Driver not found"));

        // No-op protection (optional but useful)
        if (newDriver.getId().equals(oldDriver.getId())) {
            throw new ResponseStatusException(BAD_REQUEST, "New driver is the same as current driver");
        }

        // Driver must be enabled
        if (!newDriver.isEnabled()) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver is disabled and cannot be assigned");
        }

        // Vehicle type must match booking selection
        VehicleType requiredType = booking.getSelectedVehicleType();
        VehicleType newDriverType = newDriver.getVehicle() != null ? newDriver.getVehicle().getVehicleType() : null;

        if (requiredType == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is missing selected vehicle type");
        }
        if (newDriverType == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver is missing vehicle type");
        }
        if (newDriverType != requiredType) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver vehicle type does not match booking vehicle type");
        }

        // Filter out drivers with active assignments (ASSIGNED) excluding THIS booking
        boolean driverBusy = bookingRepository.existsByDriver_IdAndStatusAndIdNot(
                newDriver.getId(),
                BookingStatus.ASSIGNED,
                booking.getId()
        );

        if (driverBusy) {
            throw new ResponseStatusException(BAD_REQUEST, "Driver already has an active assigned booking");
        }

        // Update booking
        booking.setDriver(newDriver);
        // status remains ASSIGNED
        bookingRepository.save(booking);

        // Notifications
        // 1) old driver should know they are no longer assigned
        emailService.sendDriverUnassignedEmail(oldDriver, booking);

        // 2) new driver receives assignment
        emailService.sendDriverAssignedEmail(newDriver, booking);

        // 3) customer gets updated driver info
        emailService.sendCustomerDriverAssignedEmail(newDriver, booking);

        return AssignDriverResponseDto.builder()
                .bookingId(booking.getId())
                .publicToken(booking.getPublicToken())
                .status(booking.getStatus())
                .driverId(newDriver.getId())
                .driverName(newDriver.getFirstName() + " " + newDriver.getLastName())
                .driverVehicleType(newDriverType)
                .pickupTime(booking.getPickupTime())
                .pickupAddress(booking.getPickupAddress())
                .dropoffAddress(booking.getDropoffAddress())
                .build();
    }
}
