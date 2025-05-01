package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.CityEnum;
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
    @Column(name = "neighborhood", length = 100, nullable = false)
    private String neighborhood;

    @NotNull
    @Column(name = "avenue", length = 100, nullable = false)
    private String avenue;

    @NotNull
    @Column(name = "street", length = 100, nullable = false)
    private String street;

    @Column(name = "building_number", length = 100)
    private String buildingNumber;

    @Column(name = "apartment_number", length = 100)
    private String apartment_number;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @Column(name = "city", length = 15, nullable = false)
    private CityEnum cityEnum;
}
