package com.seattleblue.booking.repository;

import com.seattleblue.booking.domain.Driver;
import com.seattleblue.booking.domain.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Driver entity.
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>, JpaSpecificationExecutor<Driver> {

    // Find all online drivers
    List<Driver> findByOnlineStatus(boolean onlineStatus);

    // Find drivers by vehicle type (useful when assigning to a booking)
    List<Driver> findByVehicle_VehicleType(VehicleType vehicleType);
    List<Driver> findByEnabledTrueAndVehicle_VehicleType(VehicleType vehicleType);
    boolean existsByPhoneNumber(String phoneNumber);

}
