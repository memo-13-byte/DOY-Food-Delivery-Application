package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.RestaurantCategory;
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
    private Double rating;
    private RestaurantCategory restaurantCategory;
    private Integer minOrderPrice;
    private Long imageId;

    public RestaurantRequest(Restaurant restaurant) {
        this.id = restaurant.getId();
        this.restaurantName = restaurant.getRestaurantName();
        this.restaurantPhone = restaurant.getRestaurantPhone();
        this.rating = restaurant.getRating();
        this.restaurantCategory = restaurant.getRestaurantCategory();
        this.minOrderPrice = restaurant.getMinOrderPrice();
        this.imageId = restaurant.getImage() == null ? null : restaurant.getImage().getId();
    }
}
