package com.seattleblue.booking.repository;

import com.seattleblue.booking.domain.FixedRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for flat-rate routes.
 */
@Repository
public interface FixedRouteRepository extends JpaRepository<FixedRoute, Long> {

    // For showing available routes in the UI
    List<FixedRoute> findByActiveTrue();
    boolean existsByNameIgnoreCase(String name);

}
