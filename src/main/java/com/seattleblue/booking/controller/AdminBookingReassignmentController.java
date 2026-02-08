package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.AssignDriverRequestDto;
import com.seattleblue.booking.dto.AssignDriverResponseDto;
import com.seattleblue.booking.service.admin.AdminReassignDriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingReassignmentController {

    private final AdminReassignDriverService reassignDriverService;

    /**
     * Reassign a booking from one driver to another.
     *
     * PUT /api/admin/bookings/{bookingId}/reassign-driver
     * Body: { "driverId": 123 }
     */
    @PutMapping("/{bookingId}/reassign-driver")
    public AssignDriverResponseDto reassignDriver(
            @PathVariable Long bookingId,
            @Valid @RequestBody AssignDriverRequestDto request
    ) {
        return reassignDriverService.reassignDriver(bookingId, request);
    }
}
