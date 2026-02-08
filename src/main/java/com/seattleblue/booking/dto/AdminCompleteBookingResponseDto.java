package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.BookingStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class AdminCompleteBookingResponseDto {
    Long bookingId;
    String publicToken;
    BookingStatus status;

    String pickupAddress;
    String dropoffAddress;
    LocalDateTime pickupTime;

    LocalDateTime completedAt;

    Long driverId;
    String driverName;

    String completionNote;
}

