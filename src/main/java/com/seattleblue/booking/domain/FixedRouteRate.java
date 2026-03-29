package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Pricing for a fixed route per vehicle type.
 * Example: Route "Airport -> Downtown", VehicleType SEDAN_4, Price 40.00
 */
@Entity
@Table(
        name = "fixed_route_rate",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_fixed_route_vehicle_type",
                columnNames = {"fixed_route_id", "vehicle_type"}
        )
)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedRouteRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Many rates belong to one fixed route.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fixed_route_id", nullable = false)
    private FixedRoute fixedRoute;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    /**
     * BigDecimal is safer for money than double.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
