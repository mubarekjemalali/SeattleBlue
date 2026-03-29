package com.seattleblue.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request to enable/disable a driver.
 */
@Data
public class UpdateDriverEnabledRequestDto {
    @NotNull
    private Boolean enabled;
}
