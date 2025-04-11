package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Restaurant;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
public class RestaurantRequest {
    private Long id;
    private String restaurantName;
    private String restaurantPhone;

    // Constructor to map from Entity to DTO
    public RestaurantRequest(Restaurant restaurant) {
        this.id = restaurant.getId();
        this.restaurantName = restaurant.getRestaurantName();
        this.restaurantPhone = restaurant.getRestaurantPhone();
    }
}
