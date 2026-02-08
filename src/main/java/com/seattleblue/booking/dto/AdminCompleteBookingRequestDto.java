package com.seattleblue.booking.dto;

import lombok.Data;

/**
 * Optional dispatcher notes when marking a booking completed.
 */
@Data
public class AdminCompleteBookingRequestDto {
    private String note;
}
