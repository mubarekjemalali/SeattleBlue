package com.seattleblue.booking.mapper;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.VehicleType;
import com.seattleblue.booking.dto.BookingCancelResponseDTO;
import com.seattleblue.booking.dto.BookingRequestDTO;
import com.seattleblue.booking.dto.BookingResponseDTO;
import com.seattleblue.booking.dto.BookingStatusResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "customerFirstName", ignore = true)
    @Mapping(target = "customerLastName", ignore = true)
    @Mapping(target = "customerPhoneNumber", ignore = true)
    @Mapping(target = "customerEmail", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "fixedRoute", ignore = true)
    @Mapping(target = "fixedRoutePrice", ignore = true)
    @Mapping(target = "estimatedFare", ignore = true)
    @Mapping(target = "distanceMiles", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "completedAt", ignore = true)
    @Mapping(target = "cancellationReason", ignore = true)
    @Mapping(target = "cancelledAt", ignore = true)
    @Mapping(target = "publicToken", ignore = true)
    @Mapping(target = "selectedVehicleType", source = "vehicleType")
    Booking toBooking(BookingRequestDTO dto);

    @Mapping(target = "bookingId", source = "id")
    @Mapping(target = "fixedRouteId", source = "fixedRoute.id")
    @Mapping(target = "vehicleType", source = "selectedVehicleType")
    @Mapping(target = "fixedRoutePrice", source = "fixedRoutePrice", qualifiedByName = "bigDecimalToDouble")
    @Mapping(target = "assignedDriverName", expression = "java(driverName(booking))")
    BookingResponseDTO toBookingResponse(Booking booking);

    @Mapping(source = "publicToken", target = "publicToken")
    @Mapping(target = "driverName", expression = "java(driverName(booking))")
    @Mapping(source = "selectedVehicleType", target = "driverVehicleType")
    BookingStatusResponseDTO toBookingStatus(Booking booking);

    @Mapping(target = "bookingId", source = "id")
    BookingCancelResponseDTO toBookingCancelResponse(Booking booking);

    @Named("bigDecimalToDouble")
    default Double bigDecimalToDouble(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }

    default String driverName(Booking booking) {
        if (booking.getDriver() == null) {
            return null;
        }
        String first = booking.getDriver().getFirstName() == null ? "" : booking.getDriver().getFirstName();
        String last = booking.getDriver().getLastName() == null ? "" : booking.getDriver().getLastName();
        String full = (first + " " + last).trim();
        return full.isEmpty() ? null : full;
    }


}
