package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.VehicleType;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * Response returned after a successful driver assignment.
 */
@Value
@Builder
public class AssignDriverResponseDto {
    Long bookingId;
    String publicToken;
    BookingStatus status;

    Long driverId;
    String driverName;
    VehicleType driverVehicleType;

    LocalDateTime pickupTime;
    String pickupAddress;
    String dropoffAddress;
}
