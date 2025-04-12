package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "customer")
@PrimaryKeyJoinColumn(name = "customer_id", referencedColumnName = "user_id")
@Getter
@Setter
public class Customer extends User {
    @ManyToMany
    @JoinTable(
            name = "favorite_restaurant",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    private final Set<Restaurant> favoriteRestaurants = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "customer_address",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "address_id")
    )
    private Set<Address> addresses = new HashSet<>();


    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Cart cart;

    public Customer() {
        super();
    }

    public Customer(String username, String email, String passwordHash) {
        super(username, email, passwordHash);
    }

    public Customer(String username, String email, String passwordHash, String phoneNumber) {
        super(username, email, passwordHash, phoneNumber);
    }
}