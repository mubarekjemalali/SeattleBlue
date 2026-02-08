package com.seattleblue.booking.repository;

import com.seattleblue.booking.domain.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for Vehicle entity.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
