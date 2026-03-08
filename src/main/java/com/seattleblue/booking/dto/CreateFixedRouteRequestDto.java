package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateFixedRouteRequestDto {

    @NotBlank
    private String name;

    @NotBlank
    private String originName;

    @NotBlank
    private String originLand;

    @NotNull
    private Double originLat;

    @NotNull
    private Double originLng;

    @NotBlank
    private String destinationName;

    @NotBlank
    private String destinationLand;

    @NotNull
    private Double destinationLat;

    @NotNull
    private Double destinationLng;

    private String description;

    @NotEmpty
    @Valid
    private List<RateItem> rates;

    @Data
    public static class RateItem {
        @NotNull
        private VehicleType vehicleType;

        @NotNull
        @DecimalMin(value = "0.00", inclusive = false)
        private BigDecimal price;
    }
}
