package com.pingfloyd.doy.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoRestaurant {
    private Long id;
    private String restaurantName;
    private String restaurantPhone;
}
