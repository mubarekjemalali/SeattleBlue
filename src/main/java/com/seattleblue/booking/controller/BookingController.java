package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.*;
import com.seattleblue.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody BookingRequestDTO dto) {

        BookingResponseDTO response = bookingService.createBooking(dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/{token}")
    public ResponseEntity<BookingStatusResponseDTO> getBookingStatus(
            @PathVariable String token) {

        return ResponseEntity.ok(
                bookingService.getStatusByPublicToken(token)
        );
    }

    @PutMapping("/public/{token}/cancel")
    public ResponseEntity<BookingCancelResponseDTO> cancelBooking(
            @PathVariable String token,
            @RequestBody BookingCancelRequestDTO request) {

        BookingCancelResponseDTO dto =
                bookingService.cancelByPublicToken(token, request.getReason());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Booking Service is up and running!");
    }

}
