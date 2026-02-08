package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.domain.VehicleType;
import com.seattleblue.booking.dto.AdminEligibleDriverDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class AdminDriverEligibilityService {

    private final BookingRepository bookingRepository;
    private final DriverRepository driverRepository;

    @Transactional(readOnly = true)
    public List<AdminEligibleDriverDto> getEligibleDrivers(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        VehicleType requiredType = booking.getSelectedVehicleType();

        // Step 1: find enabled drivers with matching vehicle type
        List<Driver> matchingDrivers =
                driverRepository.findByEnabledTrueAndVehicle_VehicleType(requiredType);

        // Step 2: find drivers already assigned to active bookings
        Set<Long> busyDriverIds =
                Set.copyOf(bookingRepository.findDriverIdsWithActiveAssignments());

        // Step 3: filter out busy drivers
        return matchingDrivers.stream()
                .filter(driver -> !busyDriverIds.contains(driver.getId()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private AdminEligibleDriverDto toDto(Driver d) {
        return AdminEligibleDriverDto.builder()
                .driverId(d.getId())
                .firstName(d.getFirstName())
                .lastName(d.getLastName())
                .phoneNumber(d.getPhoneNumber())
                .vehicleType(d.getVehicle().getVehicleType())
                .build();
    }
}
