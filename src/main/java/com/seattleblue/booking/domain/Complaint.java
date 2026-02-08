package com.seattleblue.booking.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    @Column(length = 100)
    private String tripInfo;

    @Column(length = 300)
    private String complaintDetails;
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
