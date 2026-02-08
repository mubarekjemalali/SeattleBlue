package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.AdminCompleteBookingRequestDto;
import com.seattleblue.booking.dto.AdminCompleteBookingResponseDto;
import com.seattleblue.booking.service.admin.AdminCompleteBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminCompleteBookingController {

    private final AdminCompleteBookingService completeBookingService;

    /**
     * Dispatcher marks an ASSIGNED booking as COMPLETED.
     *
     * PUT /api/admin/bookings/{bookingId}/complete
     * Body (optional): { "note": "Driver confirmed drop-off at 4:12 PM" }
     */
    @PutMapping("/{bookingId}/complete")
    public AdminCompleteBookingResponseDto completeBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) AdminCompleteBookingRequestDto request
    ) {
        return completeBookingService.completeBooking(bookingId, request);
    }
}
