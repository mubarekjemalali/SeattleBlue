package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import lombok.Builder;
import lombok.Value;

/**
 * Returned after driver creation (and later used by list/update APIs).
 */
@Value
@Builder
public class DriverResponseDto {
    Long driverId;

    String firstName;
    String lastName;
    String phoneNumber;
    String email;

    boolean enabled;
    boolean onlineStatus;

    // Vehicle
    Long vehicleId;
    VehicleType vehicleType;
    String vehiclePlate;
    String sideNumber;
    String make;
    String model;
    Integer year;
}
