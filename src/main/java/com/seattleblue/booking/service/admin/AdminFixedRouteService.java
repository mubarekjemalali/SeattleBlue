package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.FixedRoute;
import com.seattleblue.booking.domain.FixedRouteRate;
import com.seattleblue.booking.dto.CreateFixedRouteRequestDto;
import com.seattleblue.booking.dto.FixedRouteResponseDto;
import com.seattleblue.booking.repository.FixedRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class AdminFixedRouteService {

    private final FixedRouteRepository fixedRouteRepository;

    @Transactional
    public FixedRouteResponseDto createFixedRoute(CreateFixedRouteRequestDto req) {

        if (fixedRouteRepository.existsByNameIgnoreCase(req.getName().trim())) {
            throw new ResponseStatusException(CONFLICT, "A fixed route with this name already exists");
        }

        // Prevent duplicate vehicle types in request
        var seen = new HashSet<>();
        for (var r : req.getRates()) {
            if (!seen.add(r.getVehicleType())) {
                throw new ResponseStatusException(CONFLICT, "Duplicate vehicleType in rate list: " + r.getVehicleType());
            }
        }

        FixedRoute route = FixedRoute.builder()
                .name(req.getName().trim())
                .originName(req.getOriginName().trim())
                .originLand(req.getOriginLand().trim())
                .originLat(req.getOriginLat())
                .originLng(req.getOriginLng())
                .destinationName(req.getDestinationName().trim())
                .destinationLand(req.getDestinationLand().trim())
                .destinationLat(req.getDestinationLat())
                .destinationLng(req.getDestinationLng())
                .description(req.getDescription())
                .active(true)
                .build();

        // Attach rates (cascade saves them)
        for (var item : req.getRates()) {
            FixedRouteRate rate = FixedRouteRate.builder()
                    .fixedRoute(route)
                    .vehicleType(item.getVehicleType())
                    .price(item.getPrice())
                    .build();
            route.getRates().add(rate);
        }

        FixedRoute saved = fixedRouteRepository.save(route);
        return toDto(saved);
    }

    @Transactional
    public FixedRouteResponseDto updateActive(Long routeId, boolean active) {

        FixedRoute route = fixedRouteRepository.findById(routeId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Fixed route not found"));

        // Optional: avoid unnecessary DB writes, and give a clear message by still returning same state
        route.setActive(active);

        FixedRoute saved = fixedRouteRepository.save(route);
        return toDto(saved);
    }


    private FixedRouteResponseDto toDto(FixedRoute r) {
        return FixedRouteResponseDto.builder()
                .id(r.getId())
                .name(r.getName())
                .originName(r.getOriginName())
                .originLand(r.getOriginLand())
                .originLat(r.getOriginLat())
                .originLng(r.getOriginLng())
                .destinationName(r.getDestinationName())
                .destinationLand(r.getDestinationLand())
                .destinationLat(r.getDestinationLat())
                .destinationLng(r.getDestinationLng())
                .description(r.getDescription())
                .active(r.isActive())
                .rates(r.getRates().stream()
                        .map(rate -> FixedRouteResponseDto.RateDto.builder()
                                .vehicleType(rate.getVehicleType())
                                .price(rate.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
