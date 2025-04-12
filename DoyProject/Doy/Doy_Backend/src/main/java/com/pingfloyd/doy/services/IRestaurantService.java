package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import org.springframework.http.ResponseEntity;

public interface IRestaurantService {
    DtoRestaurant getRestaurant(Long id);
    DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant deleteRestaurant(Long id);
}
