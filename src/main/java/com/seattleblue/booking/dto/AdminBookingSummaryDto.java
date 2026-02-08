package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.VehicleType;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

/**
 * Summary row for dispatcher list pages.
 * Keep it lightweight and stable for UI tables.
 */
@Value
@Builder
public class AdminBookingSummaryDto {
    Long id;
    String publicToken;

    BookingStatus status;

    String customerName;
    String customerPhone;
    String customerEmail;

    String pickupAddress;
    String dropoffAddress;
    LocalDateTime pickupTime;

    VehicleType selectedVehicleType;
    Double fixedRoutePrice;

    Long driverId;
    String driverName;
    VehicleType driverVehicleType;

    Boolean driverEnabled; // helpful when you display assigned driver state
}

