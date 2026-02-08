package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fixed_route_rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FixedRouteRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Parent fixed route.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "route_id")
    private FixedRoute route;

    /**
     * Vehicle type (e.g., SEDAN_4, SUV_6, VAN_10).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleType vehicleType;

    /**
     * Flat rate price for this combination.
     */
    @Column(nullable = false)
    private Double price;
}
