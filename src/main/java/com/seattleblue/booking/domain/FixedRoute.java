package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * A fixed/flat-rate route definition, e.g. "Airport -> Downtown".
 * This is managed by dispatcher/admin and used by customers to explore flat-rate options.
 */
@Entity
@Table(name = "fixed_route")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FixedRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Display name shown to users/admin.
     * Example: "SEA Airport → Downtown".
     */
    @Column(nullable = false)
    private String name;

    // Origin
    @Column(nullable = false)
    private String originName;

    /**
     * Keep as string for now (matches autocomplete formatted address).
     */
    @Column(nullable = true, length = 400)
    private String originLand;

    @Column(nullable = true)
    private double originLat;

    @Column(nullable = true)
    private double originLng;

    // Destination
    @Column(nullable = false)
    private String destinationName;

    @Column(nullable = true, length = 400)
    private String destinationLand;

    @Column(nullable = true)
    private double destinationLat;

    @Column(nullable = true)
    private double destinationLng;

    @Column(length = 1000)
    private String description;

    /**
     * Active/Inactive is better than deleting to preserve history.
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    /**
     * One route has multiple rates (one per vehicle type).
     * Cascade saves/updates rates along with route.
     */
    @OneToMany(mappedBy = "fixedRoute", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FixedRouteRate> rates = new ArrayList<>();
}
