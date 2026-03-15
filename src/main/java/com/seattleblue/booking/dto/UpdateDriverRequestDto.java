package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateDriverRequestDto {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String phoneNumber;

    @Email
    private String email; // optional

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


        private String make;
        private String model;

        @Min(1980)
        @Max(2100)
        private Integer year;
    }
}