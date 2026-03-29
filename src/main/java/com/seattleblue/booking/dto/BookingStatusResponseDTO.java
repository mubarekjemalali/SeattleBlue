package com.seattleblue.booking.dto;


import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.VehicleType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingStatusResponseDTO {

    private String publicToken;
    private BookingStatus status;

    // Pickup / dropoff details
    private String pickupAddress;
    private String dropoffAddress;
    private LocalDateTime pickupTime;

    // Driver info (optional)
    private String driverName;
    private VehicleType driverVehicleType;
}
