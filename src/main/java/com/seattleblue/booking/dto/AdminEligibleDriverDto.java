package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import lombok.Builder;
import lombok.Value;

/**
 * Lightweight driver DTO used for assignment selection.
 */
@Value
@Builder
public class AdminEligibleDriverDto {
    Long driverId;
    String firstName;
    String lastName;
    String phoneNumber;
    VehicleType vehicleType;
}
