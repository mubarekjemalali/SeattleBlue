package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO representing the JSON body sent by the frontend
 * when a customer submits a new booking request.
 */
@Data
public class BookingStatusRequestDTO {

    // Customer info
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;

    // Pickup info
    private String pickupAddress;
    private Double pickupLat;
    private Double pickupLng;

    // Dropoff info
    private String dropoffAddress;
    private Double dropoffLat;
    private Double dropoffLng;

    private LocalDateTime pickupTime;
    private String notes;

    // Fixed route selection (optional)
    private Long fixedRouteId;

    // User-selected vehicle type for flat rate pricing
    private VehicleType vehicleType;
}
