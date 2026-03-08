package com.seattleblue.booking.controller;


import com.seattleblue.booking.dto.CreateFixedRouteRequestDto;
import com.seattleblue.booking.dto.FixedRouteResponseDto;
import com.seattleblue.booking.dto.UpdateFixedRouteActiveRequestDto;
import com.seattleblue.booking.service.admin.AdminFixedRouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/fixed-routes")
@RequiredArgsConstructor
public class AdminFixedRouteController {

    private final AdminFixedRouteService fixedRouteService;

    /**
     * Create a fixed route with per-vehicle-type pricing.
     */
    @PostMapping
    public FixedRouteResponseDto create(@Valid @RequestBody CreateFixedRouteRequestDto request) {
        return fixedRouteService.createFixedRoute(request);
    }

    /**
     * Enable/disable (activate/deactivate) a fixed route.
     *
     * PUT /api/admin/fixed-routes/{routeId}/active
     * Body: { "active": false }
     */
    @PutMapping("/{routeId}/active")
    public FixedRouteResponseDto updateActive(
            @PathVariable Long routeId,
            @Valid @RequestBody UpdateFixedRouteActiveRequestDto request
    ) {
        return fixedRouteService.updateActive(routeId, request.getActive());
    }

}
