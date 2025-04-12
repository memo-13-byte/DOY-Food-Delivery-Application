package com.pingfloyd.doy.dto;

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
}
