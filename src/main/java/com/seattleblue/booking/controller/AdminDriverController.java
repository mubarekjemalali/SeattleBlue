package com.seattleblue.booking.controller;

import com.seattleblue.booking.domain.VehicleType;
import com.seattleblue.booking.dto.CreateDriverRequestDto;
import com.seattleblue.booking.dto.DriverResponseDto;
import com.seattleblue.booking.dto.UpdateDriverEnabledRequestDto;
import com.seattleblue.booking.service.admin.AdminDriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * Admin/dispatcher driver management endpoints.
 * Security to be added later (admin-only access).
 */
@RestController
@RequestMapping("/api/admin/drivers")
@RequiredArgsConstructor
public class AdminDriverController {

    private final AdminDriverService adminDriverService;

    /**
     * Create a driver with vehicle details.
     */
    @PostMapping
    public DriverResponseDto createDriver(@Valid @RequestBody CreateDriverRequestDto request) {
        return adminDriverService.createDriver(request);
    }

    /**
     * Search/list drivers with optional filters.
     *
     * Examples:
     * GET /api/admin/drivers
     * GET /api/admin/drivers?enabled=true
     * GET /api/admin/drivers?vehicleType=SEDAN_4&enabled=true
     * GET /api/admin/drivers?q=206
     * GET /api/admin/drivers?page=0&size=20&sort=lastName,asc
     */
    @GetMapping
    public Page<DriverResponseDto> searchDrivers(
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) Boolean onlineStatus,
            @RequestParam(required = false) VehicleType vehicleType,
            @RequestParam(required = false) String q,
            Pageable pageable
    ) {
        return adminDriverService.searchDrivers(enabled, onlineStatus, vehicleType, q, pageable);
    }


    /**
     * Enable/disable a driver.
     * Disabling is blocked if driver has an active ASSIGNED booking.
     */
    @PutMapping("/{driverId}/enabled")
    public DriverResponseDto updateDriverEnabled(
            @PathVariable Long driverId,
            @Valid @RequestBody UpdateDriverEnabledRequestDto request
    ) {
        return adminDriverService.updateDriverEnabled(driverId, request.getEnabled());
    }



}
