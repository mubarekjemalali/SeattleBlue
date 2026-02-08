package com.seattleblue.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request body for assigning a driver to a booking.
 */
@Data
public class AssignDriverRequestDto {
    @NotNull
    private Long driverId;
}
