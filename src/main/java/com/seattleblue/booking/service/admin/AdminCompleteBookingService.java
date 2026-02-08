package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.dto.AdminCompleteBookingRequestDto;
import com.seattleblue.booking.dto.AdminCompleteBookingResponseDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class AdminCompleteBookingService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Transactional
    public AdminCompleteBookingResponseDto completeBooking(Long bookingId, AdminCompleteBookingRequestDto request) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));

        // Only ASSIGNED bookings can be completed (keeps the workflow clean)
        if (booking.getStatus() != BookingStatus.ASSIGNED) {
            throw new ResponseStatusException(BAD_REQUEST, "Only ASSIGNED bookings can be completed");
        }

        // Mark completed
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletedAt(LocalDateTime.now());

        // Optional note appended to notes (if you have notes)
        String note = request != null ? request.getNote() : null;
        if (note != null && !note.isBlank() && booking.getCancellationReason() != null) {
            String existing = booking.getCancellationReason().trim();
            booking.setCancellationReason(existing + "\n\n[Completion Note] " + note.trim());
        } else if (note != null && !note.isBlank() && booking.getCancellationReason() == null) {
            booking.setCancellationReason("[Completion Note] " + note.trim());
        }

        bookingRepository.save(booking);

        // Notifications (optional but useful)
        emailService.sendCustomerTripCompletedEmail(booking);
        emailService.sendAdminTripCompletedEmail(booking);

        Driver d = booking.getDriver();

        return AdminCompleteBookingResponseDto.builder()
                .bookingId(booking.getId())
                .publicToken(booking.getPublicToken())
                .status(booking.getStatus())
                .pickupAddress(booking.getPickupAddress())
                .dropoffAddress(booking.getDropoffAddress())
                .pickupTime(booking.getPickupTime())
                .completedAt(booking.getCompletedAt())
                .driverId(d == null ? null : d.getId())
                .driverName(d == null ? null : (d.getFirstName() + " " + d.getLastName()))
                .completionNote(note)
                .build();
    }
}
