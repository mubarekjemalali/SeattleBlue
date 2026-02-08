package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.dto.AdminCancelBookingRequestDto;
import com.seattleblue.booking.dto.AdminCancelBookingResponseDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AdminCancelBookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Transactional
    public AdminCancelBookingResponseDto cancelBooking(Long bookingId, AdminCancelBookingRequestDto request) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Can't cancel if already terminal
        if (booking.getStatus() == BookingStatus.COMPLETED
                || booking.getStatus() == BookingStatus.CANCELLED_BY_CUSTOMER
                || booking.getStatus() == BookingStatus.CANCELLED_BY_DISPATCHER) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is already completed/cancelled");
        }

        String reason = request != null ? request.getReason() : null;

        // Update status
        booking.setStatus(BookingStatus.CANCELLED_BY_DISPATCHER);

        // Store reason if your Booking has a notes field; otherwise skip this.
        if (reason != null && !reason.isBlank()) {
            // Best practice: append to notes instead of overwriting
            String existing = booking.getCancellationReason() == null ? "" : booking.getCancellationReason().trim();
            String appended = (existing.isEmpty() ? "" : (existing + "\n\n"))
                    + "[Dispatcher Cancel Reason] " + reason.trim();
            booking.setCancellationReason(appended);
        }

        bookingRepository.save(booking);

        // Emails
        // 1) customer
        emailService.sendCustomerBookingCancelledByDispatcherEmail(booking, reason);

        // 2) admin/dispatcher mailbox (audit/visibility)
        emailService.sendAdminBookingCancelledByDispatcherEmail(booking, reason);

        // 3) driver (only if a driver was assigned)
        Driver driver = booking.getDriver();
        if (driver != null) {
            emailService.sendDriverBookingCancelledEmail(driver, booking);
        }

        return AdminCancelBookingResponseDto.builder()
                .bookingId(booking.getId())
                .publicToken(booking.getPublicToken())
                .status(booking.getStatus())
                .pickupAddress(booking.getPickupAddress())
                .dropoffAddress(booking.getDropoffAddress())
                .pickupTime(booking.getPickupTime())
                .driverId(driver == null ? null : driver.getId())
                .driverName(driver == null ? null : (driver.getFirstName() + " " + driver.getLastName()))
                .cancellationReason(reason)
                .build();
    }
}
