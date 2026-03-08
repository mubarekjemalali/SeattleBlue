package com.seattleblue.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Enable/disable a fixed route (soft delete).
 */
@Data
public class UpdateFixedRouteActiveRequestDto {

    @NotNull
    private Boolean active;
}
