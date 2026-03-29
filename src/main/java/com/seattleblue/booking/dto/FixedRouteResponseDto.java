package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.VehicleType;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
@Builder
public class FixedRouteResponseDto {
    Long id;
    String name;

    String originName;
    String originLand;
    double originLat;
    double originLng;

    String destinationName;
    String destinationLand;
    double destinationLat;
    double destinationLng;

    String description;
    boolean active;

    List<RateDto> rates;

    @Value
    @Builder
    public static class RateDto {
        VehicleType vehicleType;
        BigDecimal price;
    }
}
