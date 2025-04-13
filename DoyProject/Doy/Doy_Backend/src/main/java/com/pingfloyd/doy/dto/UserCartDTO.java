package com.pingfloyd.doy.dto; // Adjust package as needed

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
public class UserCartDTO {

    private Long cartId;        // ID of the Cart entity, can be null if no cart
    private Long restaurantId;  // ID of the Restaurant linked to the cart, can be null
    private String restaurantName;// Name of the Restaurant, can be null
    private List<ItemInfo> items = new ArrayList<>(); // List of items in the cart
    // Optional: Add total price if calculated in service
    // private BigDecimal totalPrice;

    // Nested static class for item details within the single DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class ItemInfo {
        private Long menuItemId;
        private String name;
        private BigDecimal price;
        private String description;
        private int quantity;
        // private String imageUrl; // Add if needed
        // private Long cartItemId; // Optional: ID of the CartItem link itself
    }
}