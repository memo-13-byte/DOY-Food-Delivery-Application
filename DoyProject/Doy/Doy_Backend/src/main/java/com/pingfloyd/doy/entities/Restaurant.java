package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import javax.annotation.processing.Generated;

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
