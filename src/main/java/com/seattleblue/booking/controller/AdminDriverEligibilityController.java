package com.seattleblue.booking.controller;

import com.seattleblue.booking.dto.AdminEligibleDriverDto;
import com.seattleblue.booking.service.admin.AdminDriverEligibilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
public class AdminDriverEligibilityController {

    private final AdminDriverEligibilityService eligibilityService;

    /**
     * Returns drivers eligible to be assigned to a booking.
     */
    @GetMapping("/{bookingId}/eligible-drivers")
    public List<AdminEligibleDriverDto> getEligibleDrivers(@PathVariable Long bookingId) {
        return eligibilityService.getEligibleDrivers(bookingId);
    }
}
