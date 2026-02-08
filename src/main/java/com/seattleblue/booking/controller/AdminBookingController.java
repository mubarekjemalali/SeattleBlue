package com.seattleblue.booking.controller;

import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.dto.AdminBookingSummaryDto;
import com.seattleblue.booking.service.admin.AdminBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    /**
     * Dispatcher list endpoint:
     * - filter by status, date range
     * - search by customer (q)
     * - pagination + sorting
     */
    @GetMapping
    public Page<AdminBookingSummaryDto> listBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) String q,
            Pageable pageable
    ) {
        return adminBookingService.listBookings(status, from, to, q, pageable);
    }
}
