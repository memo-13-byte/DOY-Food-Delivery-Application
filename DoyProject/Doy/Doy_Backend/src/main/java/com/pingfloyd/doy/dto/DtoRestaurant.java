package com.pingfloyd.doy.dto;

import java.time.LocalTime;
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
    private Long ratingCount;
    private Integer minOrderPrice;

    private Address address;
    private Long imageId;

    private LocalTime openingHour;
    private LocalTime closingHour;
}
