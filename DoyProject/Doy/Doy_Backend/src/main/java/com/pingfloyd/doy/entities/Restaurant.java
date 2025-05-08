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
    @Column(name = "restaurant_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "restaurant_id", referencedColumnName = "owner_id")
    private RestaurantOwner restaurantOwner;

    @NotNull
    @Column(name = "restaurant_name", nullable = false, length = 100)
    private String restaurantName;

    @Column(name = "description")
    private String description;

    @Column(name = "restaurant_phone")
    private String restaurantPhone;

    @Column(name = "min_order_price")
    private Integer minOrderPrice;

    @Column(name="rating")
    private Double rating = 0.0;

    @Column(name="rating_count")
    private Long ratingCount = 0L;

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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id", referencedColumnName = "image_id")
    private Image image;

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
