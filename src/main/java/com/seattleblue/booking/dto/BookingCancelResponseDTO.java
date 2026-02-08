package com.seattleblue.booking.dto;

import com.seattleblue.booking.domain.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingCancelResponseDTO {
    private Long bookingId;
    private BookingStatus status;
    private LocalDateTime cancelledAt;
}

