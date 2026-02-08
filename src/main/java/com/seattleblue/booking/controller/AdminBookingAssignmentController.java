package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.AssignDriverRequestDto;
import com.seattleblue.booking.dto.AssignDriverResponseDto;
import com.seattleblue.booking.service.admin.AdminAssignDriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Admin endpoints for assigning drivers to bookings.
 */
@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingAssignmentController {

    private final AdminAssignDriverService adminAssignDriverService;

    /**
     * Assign a driver to a booking.
     *
     * PUT /api/admin/bookings/{bookingId}/assign-driver
     * Body: { "driverId": 123 }
     */
    @PutMapping("/{bookingId}/assign-driver")
    public AssignDriverResponseDto assignDriver(
            @PathVariable Long bookingId,
            @Valid @RequestBody AssignDriverRequestDto request
    ) {
        return adminAssignDriverService.assignDriver(bookingId, request);
    }
}
