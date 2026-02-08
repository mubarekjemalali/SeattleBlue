package com.seattleblue.booking.service.admin;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.dto.AdminBookingSummaryDto;
import com.seattleblue.booking.repository.BookingRepository;
import com.seattleblue.booking.repository.spec.BookingSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminBookingService {

    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public Page<AdminBookingSummaryDto> listBookings(
            BookingStatus status,
            LocalDateTime from,
            LocalDateTime to,
            String q,
            Pageable pageable
    ) {
        Specification<Booking> spec = Specification
                .where(BookingSpecifications.hasStatus(status))
                .and(BookingSpecifications.pickupTimeFrom(from))
                .and(BookingSpecifications.pickupTimeTo(to))
                .and(BookingSpecifications.customerSearch(q));

        return bookingRepository.findAll(spec, pageable).map(this::toDto);
    }

    private AdminBookingSummaryDto toDto(Booking b) {
        Driver d = b.getDriver();

        return AdminBookingSummaryDto.builder()
                .id(b.getId())
                .publicToken(b.getPublicToken())
                .status(b.getStatus())

                .customerName(b.getCustomerFirstName() + " " + b.getCustomerLastName())
                .customerPhone(b.getCustomerPhoneNumber())
                .customerEmail(b.getCustomerEmail())

                .pickupAddress(b.getPickupAddress())
                .dropoffAddress(b.getDropoffAddress())
                .pickupTime(b.getPickupTime())

                .selectedVehicleType(b.getSelectedVehicleType())
                .fixedRoutePrice(b.getFixedRoutePrice())

                .driverId(d == null ? null : d.getId())
                .driverName(d == null ? null : (d.getFirstName() + " " + d.getLastName()))
                .driverVehicleType(d == null ? null : d.getVehicle().getVehicleType())
                .driverEnabled(d == null ? null : d.isEnabled())
                .build();
    }
}
