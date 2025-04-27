package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "government_id")
@Getter
@Setter
@NoArgsConstructor
public class GovernmentId {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gid")
    private Long gid;

    @NotBlank
    @Column(name = "id_number", unique = true, nullable = false, updatable = false)
    private String idNumber;
}
