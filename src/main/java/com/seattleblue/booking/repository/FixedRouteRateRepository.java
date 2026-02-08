package com.seattleblue.booking.repository;

import com.seattleblue.booking.domain.FixedRoute;
import com.seattleblue.booking.domain.FixedRouteRate;
import com.seattleblue.booking.domain.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for route pricing based on vehicle type.
 */
@Repository
public interface FixedRouteRateRepository extends JpaRepository<FixedRouteRate, Long> {

    // Get all rates for a specific route (useful for admin panel)
    List<FixedRouteRate> findByRoute(FixedRoute route);

    // When the customer selects a route + vehicle type, get the exact price
    Optional<FixedRouteRate> findByRouteAndVehicleType(FixedRoute route, VehicleType vehicleType);
}
