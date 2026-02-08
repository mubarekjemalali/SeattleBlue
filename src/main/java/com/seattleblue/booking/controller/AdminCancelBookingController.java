package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.AdminCancelBookingRequestDto;
import com.seattleblue.booking.dto.AdminCancelBookingResponseDto;
import com.seattleblue.booking.service.admin.AdminCancelBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminCancelBookingController {

    private final AdminCancelBookingService cancelBookingService;

    /**
     * Dispatcher cancels a booking on behalf of the customer.
     *
     * PUT /api/admin/bookings/{bookingId}/cancel
     * Body: { "reason": "Customer requested cancellation by phone" }
     */
    @PutMapping("/{bookingId}/cancel")
    public AdminCancelBookingResponseDto cancelBooking(
            @PathVariable Long bookingId,
            @RequestBody(required = false) AdminCancelBookingRequestDto request
    ) {
        return cancelBookingService.cancelBooking(bookingId, request);
    }
}
