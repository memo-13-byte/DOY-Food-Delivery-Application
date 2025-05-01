package com.pingfloyd.doy.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pingfloyd.doy.enums.CityEnum;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "district")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "district_id")
    private Long districtId;

    @Size(max = 255)
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "city")
    @Enumerated(EnumType.STRING)
    private CityEnum city;

    @OneToMany(mappedBy = "district", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<Courier> couriers;
}
