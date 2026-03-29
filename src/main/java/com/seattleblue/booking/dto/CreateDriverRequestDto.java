package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Admin request for creating a driver with vehicle details.
 */
@Data
public class CreateDriverRequestDto {

    // Driver
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String phoneNumber;

    @Email
    @NotBlank
    private String email; // optional

    // Vehicle details (required for assignment workflows)
    @Valid
    @NotNull
    private VehicleDto vehicle;

    @Data
    public static class VehicleDto {
        @NotNull
        private VehicleType vehicleType;

        @NotBlank
        private String vehiclePlate;

        private String sideNumber; // optional

        private String make;   // optional
        private String model;  // optional

        @Min(1980)
        @Max(2100)
        private Integer year;  // optional
    }
}
