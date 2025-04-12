package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.RestaurantCategory;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoRestaurantIU {
    @NotNull(message = "Restaurant name must not be empty")
    @Size(min = 2,max = 100,message = "Restaurant name must not exceed 100 characters")
    private String restaurantName;

    private String restaurantPhone;

    private RestaurantCategory restaurantCategory ;
    private Double rating;
    private Integer minOrderPrice;
}
