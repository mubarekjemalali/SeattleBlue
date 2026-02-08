package com.seattleblue.booking.dto;

import lombok.Data;

/**
 * Dispatcher cancellation request.
 * Reason is optional but helps operationally.
 */
@Data
public class AdminCancelBookingRequestDto {
    private String reason;
}
