package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "restaurant_owner")
@PrimaryKeyJoinColumn(name = "owner_id", referencedColumnName = "user_id")
@Getter
@Setter
public class RestaurantOwner extends User {


    @OneToOne(mappedBy = "restaurantOwner", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Restaurant restaurant;
    private String governmentId;
    public RestaurantOwner(String firstName, String lastName, String email, String passwordHash, String phoneNumber) {
        super(firstName, lastName, email, passwordHash, phoneNumber);
    }

    public RestaurantOwner() {

    }
}
