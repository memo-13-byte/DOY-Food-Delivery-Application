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
@PrimaryKeyJoinColumn(name = "user_id")
@Getter
@Setter
public class Customer extends User {
    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "preferred_payment_method", length = 50)
    private String preferredPaymentMethod;
    // psql -U samet -d DOY
    @ManyToMany
    @JoinTable(
            name = "favorite_restaurant",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "restaurant_id")
    )
    private Set<Restaurant> favoriteRestaurants = new HashSet<>();


    // --- Cart Relationship ---
    // One Customer has One Cart
    // 'mappedBy = "customer"': Refers to the 'customer' field in the Cart entity
    // Cascade ALL: Cart lifecycle is tied to Customer lifecycle
    // orphanRemoval = true: If you set customer.setCart(null), the old cart gets deleted
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    // Use @PrimaryKeyJoinColumn on the owning side if you prefer that configuration style,
    // but mappedBy + @MapsId on the other side is very common too.
    // @PrimaryKeyJoinColumn(name = "user_id", referencedColumnName = "id") // Alternative config
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