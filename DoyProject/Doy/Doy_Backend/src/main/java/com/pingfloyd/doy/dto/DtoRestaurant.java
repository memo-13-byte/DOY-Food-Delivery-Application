package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.enums.RestaurantCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoRestaurant {
    private Long id;
    private String restaurantName;
    private String restaurantPhone;
    private String description;

    private RestaurantCategory restaurantCategory;
    private Double rating;
    private Integer minOrderPrice;

    private Address address;
}
