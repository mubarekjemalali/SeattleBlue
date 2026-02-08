package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a physical vehicle used for taxi service.
 * Each Driver is assigned exactly one Vehicle in the MVP,
 * but this model allows extension to multiple vehicles per driver in future.
 */
@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Vehicle manufacturer, e.g. "Toyota"
     */
    @Column(name = "make")
    private String make;

    /**
     * Vehicle model, e.g. "Camry", "Odyssey"
     */
    @Column(name = "model")
    private String model;

    /**
     * Vehicle year, e.g. 2018
     */
    @Column(name = "year")
    private Integer year;

    /**
     * License plate number or medallion.
     */
    @Column(name = "plate_number")
    private String plateNumber;

    @Column(name = "side_number")
    private String sideNumber;
    /**
     * Vehicle category/capacity used for pricing and booking rules.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    private VehicleType vehicleType;
}