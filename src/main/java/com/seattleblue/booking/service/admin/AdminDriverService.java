package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.domain.Vehicle;
import com.seattleblue.booking.domain.VehicleType;
import com.seattleblue.booking.dto.CreateDriverRequestDto;
import com.seattleblue.booking.dto.DriverResponseDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.repository.DriverRepository;
import com.seattleblue.booking.repository.VehicleRepository;
import com.seattleblue.booking.repository.spec.DriverSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AdminDriverService {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public DriverResponseDto createDriver(CreateDriverRequestDto req) {

        // Optional but recommended: prevent duplicate drivers by phone number
        if (driverRepository.existsByPhoneNumber(req.getPhoneNumber())) {
            throw new ResponseStatusException(CONFLICT, "Driver phone number already exists");
        }

        Vehicle v = new Vehicle();
        v.setVehicleType(req.getVehicle().getVehicleType());
        v.setPlateNumber(req.getVehicle().getVehiclePlate());
        v.setMake(req.getVehicle().getMake());
        v.setModel(req.getVehicle().getModel());
        v.setYear(req.getVehicle().getYear());

        // Save vehicle first (simple + explicit)
        v = vehicleRepository.save(v);

        Driver d = new Driver();
        d.setFirstName(req.getFirstName());
        d.setLastName(req.getLastName());
        d.setPhoneNumber(req.getPhoneNumber());
        d.setEmail(req.getEmail());

        // defaults for new drivers
        d.setEnabled(true);
        d.setOnlineStatus(false);

        d.setVehicle(v);

        d = driverRepository.save(d);

        return toDto(d);
    }
    @Transactional(readOnly = true)
    public Page<DriverResponseDto> searchDrivers(
            Boolean enabled,
            Boolean onlineStatus,
            VehicleType vehicleType,
            String q,
            Pageable pageable
    ) {
        Specification<Driver> spec = Specification
                .where(DriverSpecifications.enabled(enabled))
                .and(DriverSpecifications.onlineStatus(onlineStatus))
                .and(DriverSpecifications.vehicleType(vehicleType))
                .and(DriverSpecifications.search(q));

        return driverRepository.findAll(spec, pageable).map(this::toDto);
    }

    @Transactional
    public DriverResponseDto updateDriverEnabled(Long driverId, boolean enabled) {

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Driver not found"));

        // If disabling, enforce: no active assigned trips
        if (!enabled) {
            boolean hasActiveAssignment =
                    bookingRepository.existsByDriver_IdAndStatus(driverId, BookingStatus.ASSIGNED);

            if (hasActiveAssignment) {
                throw new ResponseStatusException(
                        CONFLICT,
                        "Driver cannot be disabled because they have an active ASSIGNED trip. " +
                                "Complete or reassign the booking first."
                );
            }
        }

        driver.setEnabled(enabled);
        Driver saved = driverRepository.save(driver);

        return toDto(saved);
    }


    private DriverResponseDto toDto(Driver d) {
        Vehicle v = d.getVehicle();

        return DriverResponseDto.builder()
                .driverId(d.getId())
                .firstName(d.getFirstName())
                .lastName(d.getLastName())
                .phoneNumber(d.getPhoneNumber())
                .email(d.getEmail())
                .enabled(d.isEnabled())
                .onlineStatus(d.isOnlineStatus())
                .vehicleId(v == null ? null : v.getId())
                .vehicleType(v == null ? null : v.getVehicleType())
                .vehiclePlate(v == null ? null : v.getPlateNumber())
                .make(v == null ? null : v.getMake())
                .model(v == null ? null : v.getModel())
                .year(v == null ? null : v.getYear())
                .build();
    }
}

