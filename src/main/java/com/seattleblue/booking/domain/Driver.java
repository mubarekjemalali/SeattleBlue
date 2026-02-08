package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a driver in the taxi system.
 * Vehicle information is stored in a separate Vehicle entity
 * to keep the system modular and future-proof.
 */
@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Driver identity info ---

    @NotBlank
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @NotBlank
    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Email
    @Column(name = "email")
    private String email; // optional

    @Column(nullable = false)
    private boolean enabled = true;


    // --- Relationship to Vehicle ---

    /**
     * Each driver has one assigned vehicle in the MVP.
     * In the future, this can become OneToMany if needed.
     * CascadeType.ALL ensures vehicle is persisted when driver is saved.
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;


    // --- Status & rating ---

    @Column(name = "online_status")
    private boolean onlineStatus = true;

    @Column(name = "rating")
    private Double rating; // optional


    // --- Convenience method, not persisted ---

    @Transient
    public String getFullName() {
        if (lastName == null || lastName.isBlank()) {
            return firstName;
        }
        return firstName + " " + lastName;
    }
}