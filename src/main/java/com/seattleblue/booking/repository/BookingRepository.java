package com.seattleblue.booking.repository;

import com.seattleblue.booking.domain.Booking;
import com.seattleblue.booking.domain.BookingStatus;
import com.seattleblue.booking.domain.Customer;
import com.seattleblue.booking.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Booking entity.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    // Allow customer to retrieve booking via email link
    Optional<Booking> findByPublicToken(String publicToken);

    // Dispatcher view: today's bookings, active ones, etc.
    List<Booking> findByStatus(BookingStatus status);

    // Retrieve all bookings made by a customer
    List<Booking> findByCustomer(Customer customer);

    // Driver portal: list all bookings assigned to a driver
    List<Booking> findByDriver(Driver driver);

    // Driver portal: live "ongoing trip" view
    List<Booking> findByDriverAndStatus(Driver driver, BookingStatus status);

    @Query("""
    select distinct b.driver.id
    from Booking b
    where b.driver is not null
      and b.status = com.seattleblue.booking.domain.BookingStatus.ASSIGNED
    """)
    List<Long> findDriverIdsWithActiveAssignments();

    boolean existsByDriver_IdAndStatusAndIdNot(Long driverId, BookingStatus status, Long excludeBookingId);

}
