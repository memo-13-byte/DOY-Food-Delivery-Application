package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private long addressID;

    @NotNull
    @Column(name = "street", length = 100, nullable = false)
    private String street;

    @NotNull
    @Column(name = "city", length = 50, nullable = false)
    private String city;

    @Column(name = "state_or_region", length = 100)
    private String stateOrRegion;

    @Column(name = "zip_code", length = 15)
    private String zip_code;


}
