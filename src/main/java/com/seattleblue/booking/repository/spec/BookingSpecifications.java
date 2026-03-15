package com.seattleblue.booking.repository.spec;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public final class BookingSpecifications {

    private BookingSpecifications() {}

//    public static Specification<Booking> hasStatus(String status) {
//        return (root, query, cb) ->
//                status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
//    }
public static Specification<Booking> hasStatus(String status) {
    return (root, query, cb) -> {
        if (status == null || status.isBlank()) {
            return cb.conjunction();
        }

        String normalized = status.trim().toUpperCase();

        if ("CANCELLED".equals(normalized)) {
            return root.get("status").in(
                    BookingStatus.CANCELLED_BY_CUSTOMER,
                    BookingStatus.CANCELLED_BY_DISPATCHER
            );
        }

        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(normalized);
            return cb.equal(root.get("status"), bookingStatus);
        } catch (IllegalArgumentException ex) {
            // Unknown status value: return no rows instead of throwing
            return cb.disjunction();
        }
    };
}

    public static Specification<Booking> pickupTimeFrom(LocalDateTime from) {
        return (root, query, cb) ->
                from == null ? cb.conjunction() : cb.greaterThanOrEqualTo(root.get("pickupTime"), from);
    }

    public static Specification<Booking> pickupTimeTo(LocalDateTime to) {
        return (root, query, cb) ->
                to == null ? cb.conjunction() : cb.lessThanOrEqualTo(root.get("pickupTime"), to);
    }

    /**
     * Search customer snapshot fields (name/phone/email) using a single query string.
     * We use snapshot fields so results are stable even if Customer record changes later.
     */
    public static Specification<Booking> customerSearch(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();

            String like = "%" + q.trim().toLowerCase() + "%";
            var firstName = cb.lower(root.get("customerFirstName"));
            var lastName = cb.lower(root.get("customerLastName"));
            var fullName = cb.lower(cb.concat(cb.concat(root.get("customerFirstName"), " "), root.get("customerLastName")));

            return cb.or(
                    cb.like(firstName, like),
                    cb.like(lastName, like),
                    cb.like(fullName, like),
                    cb.like(cb.lower(root.get("customerPhoneNumber")), like),
                    cb.like(cb.lower(root.get("customerEmail")), like)
            );
        };
    }
}
