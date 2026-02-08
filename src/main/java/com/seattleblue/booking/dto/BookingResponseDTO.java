package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.VehicleType;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO returned to frontend after creating a new booking.
 */
@Data
public class BookingResponseDTO {

    private Long bookingId;
    private String publicToken;

    private BookingStatus status;

    private String pickupAddress;
    private String dropoffAddress;
    private LocalDateTime pickupTime;

    // Fixed route info
    private Long fixedRouteId;
    private VehicleType vehicleType;
    private Double fixedRoutePrice;

    // Driver assignment info (optional)
    private String assignedDriverName;
}
