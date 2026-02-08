package com.seattleblue.booking.dto;

import lombok.Data;

@Data
public class BookingCancelRequestDTO {
    private String reason; // optional
}
