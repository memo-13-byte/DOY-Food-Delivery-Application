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
    @Column(name = "user_id")
    private Long customerId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private Customer customer;

    @Column(name = "status", length = 20)
    private String status;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Set<CartItem> items = new HashSet<>();

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