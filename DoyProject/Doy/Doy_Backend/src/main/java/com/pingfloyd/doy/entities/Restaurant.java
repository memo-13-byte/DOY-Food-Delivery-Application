package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import javax.annotation.processing.Generated;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "restaurant")
@Getter
@Setter
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Long id;

    @NotNull
    @Column(name = "restaurant_name", nullable = false, length = 100)
    private String restaurantName;

    @Column(name = "restaurant_phone")
    private String restaurantPhone;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private final Set<CustomerOrder> orders = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private final Set<MenuItem> menuItems = new HashSet<>();

    public Restaurant() {

    }

    public Restaurant(String restaurantName) {
        setRestaurantName(restaurantName);
    }

    public Restaurant(String restaurantName, String restaurantPhone) {
        this(restaurantName);
        setRestaurantPhone(restaurantPhone);
    }
}
