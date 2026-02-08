package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fixed_routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FixedRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the route (e.g. "Airport to Downtown").
     */
    @Column(nullable = false)
    private String name;

    private String originName;
    private Double originLng;
    private Double originLat;

    private String destinationName;
    private Double destinationLng;
    private Double destinationLat;
    /**
     * Optional description or notes.
     */
    private String description;


    /**
     * Whether this route is currently active.
     */
    @Column(nullable = false)
    private boolean active = true;
}
