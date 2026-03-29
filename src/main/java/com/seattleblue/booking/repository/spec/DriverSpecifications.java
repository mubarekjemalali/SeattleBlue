package com.seattleblue.booking.repository.spec;

import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.domain.Vehicle;
import com.seattleblue.booking.domain.VehicleType;
import org.springframework.data.jpa.domain.Specification;

public final class DriverSpecifications {

    private DriverSpecifications() {}

    public static Specification<Driver> enabled(Boolean enabled) {
        return (root, query, cb) -> enabled == null ? cb.conjunction() : cb.equal(root.get("enabled"), enabled);
    }

    public static Specification<Driver> onlineStatus(Boolean onlineStatus) {
        return (root, query, cb) -> onlineStatus == null ? cb.conjunction() : cb.equal(root.get("onlineStatus"), onlineStatus);
    }

    public static Specification<Driver> vehicleType(VehicleType vehicleType) {
        return (root, query, cb) -> {
            if (vehicleType == null) return cb.conjunction();
            // join to vehicle table
            var vehicleJoin = root.join("vehicle");
            return cb.equal(vehicleJoin.get("vehicleType"), vehicleType);
        };
    }

    /**
     * Free-text search across driver + vehicle fields.
     * This supports UI search boxes.
     *
     * Searches:
     * - firstName, lastName
     * - phoneNumber, email
     * - vehiclePlate
     */
    public static Specification<Driver> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();

            String like = "%" + q.trim().toLowerCase() + "%";

            var vehicleJoin = root.join("vehicle");

            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), like),
                    cb.like(cb.lower(root.get("lastName")), like),
                    cb.like(cb.lower(root.get("phoneNumber")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(vehicleJoin.get("plateNumber")), like)
            );
        };
    }
}
