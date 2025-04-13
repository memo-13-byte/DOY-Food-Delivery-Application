package com.pingfloyd.doy.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "cart")
@NoArgsConstructor
@Getter
@Setter
public class Cart {
    @Id
    @Column(name = "cart_id")
    private Long cartId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "cart_id", referencedColumnName = "customer_id")
    private Customer customer;

    @Column(name = "status", length = 20)
    private String status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<CartItem> items = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY) // Many Carts can reference one Restaurant
    // @MapsId removed - cartId is NOT determined by the restaurantId
    @JoinColumn(name = "restaurant_id", // This is the FOREIGN KEY column in the 'cart' table
            referencedColumnName = "restaurant_id", // This refers to the PRIMARY KEY column in the 'restaurant' table
            nullable = false) // A cart must belong to a restaurant (optional, but likely desired)
    private Restaurant restaurant;



    // Helper method to add an item to cart
    public void addItem(MenuItem menuItem, int quantity) {
        CartItem item = new CartItem();
        item.setCart(this);
        item.setMenuItem(menuItem);
        item.setQuantity(quantity);
        items.add(item);
    }

    // Remove an item from cart
    public void removeItem(CartItem item) {
        items.remove(item);
    }
}