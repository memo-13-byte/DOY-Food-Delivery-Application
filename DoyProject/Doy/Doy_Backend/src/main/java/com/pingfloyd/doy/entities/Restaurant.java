package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.RestaurantCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

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

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "restaurant_phone")
    private String restaurantPhone;

    @Column(name = "min_order_price")
    private Integer minOrderPrice;

    @Column(name = "rating")
    private Double rating;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "restaurant_category", length = 30, nullable = false)
    private RestaurantCategory restaurantCategory;


    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private final Set<CustomerOrder> orders = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private final Set<MenuItem> menuItems = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "address_id", referencedColumnName = "address_id")
    private Address address;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "restaurant_id", referencedColumnName = "owner_id")
    private RestaurantOwner restaurantOwner;

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
