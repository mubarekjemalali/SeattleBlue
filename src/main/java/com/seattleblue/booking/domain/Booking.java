package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a taxi booking made by a customer.
 *
 * Each booking may optionally have an assigned driver.
 * The booking contains pickup/dropoff locations, their coordinates,
 * status, pricing info, timestamps, and cancellation details.
 */
@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================
    // Customer who made the booking
    // ============================

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "customer_first_name", nullable = false)
    private String customerFirstName;
    @Column(name = "customer_last_name", nullable = false)
    private String customerLastName;
    @Column(name = "customer_phone_number", nullable = false)
    private String customerPhoneNumber;
    @Column(name = "customer_email")
    private String customerEmail;


    // ============================
    // Driver (nullable until assigned)
    // ============================

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    // ============================
    // Pickup information
    // ============================

    @Column(name = "pickup_address", nullable = false)
    private String pickupAddress;

    @Column(name = "pickup_lat", nullable = true)
    private Double pickupLat;

    @Column(name = "pickup_lng", nullable = true)
    private Double pickupLng;

    // ============================
    // Dropoff information
    // ============================

    @Column(name = "dropoff_address", nullable = false)
    private String dropoffAddress;

    @Column(name = "dropoff_lat", nullable = true)
    private Double dropoffLat;

    @Column(name = "dropoff_lng", nullable = true)
    private Double dropoffLng;

    // ============================
    // Scheduling
    // ============================

    /**
     * When the customer wants to be picked up.
     */
    @Column(name = "pickup_time", nullable = false)
    private LocalDateTime pickupTime;

    // ============================
    // Vehicle and Pricing model for fixed rate bookings
    // ============================

    @Enumerated(EnumType.STRING)
    @Column(name = "selected_vehicle_type")
    private VehicleType selectedVehicleType;

    /**
     * Optional link to fixed-route pricing.
     * If present → booking uses a fixed route fare.
     * If null → booking uses distance-based fare.
     */
    @ManyToOne
    @JoinColumn(name = "fixed_route_id")
    private FixedRoute fixedRoute;

    @Column(name = "fixed_route_price")
    private BigDecimal fixedRoutePrice; // Optional: set only when fixedRoute is used

    /**
     * The calculated distance-based fare (if applicable).
     * Not required for MVP but future-proof.
     */
    @Column(name = "estimated_fare")
    private Double estimatedFare;

    @Column(name = "distance_miles")
    private Double distanceMiles;

    @Column(name = "notes", length = 2000)
    private String notes;

    // ============================
    // Status & lifecycle
    // ============================

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.CREATED;

    /**
     * Auto-set when booking is created.
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * When the booking was completed (or cancelled).
     */
    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // ============================
    // Manage booking cancellations
    // ============================

    /**
     * If customer or dispatcher cancels the booking,
     * we store who/what timestamp.
     */
    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // ============================
    // Tracking & external access
    // ============================

    /**
     * Random token to allow customers to retrieve booking status
     * without logging in (for cancellation, tracking driver, etc.).
     */
    @Column(name = "public_token", unique = true, nullable = false)
    private String publicToken;

}
