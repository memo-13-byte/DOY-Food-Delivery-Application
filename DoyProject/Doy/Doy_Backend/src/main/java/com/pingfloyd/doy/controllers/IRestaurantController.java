package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import org.springframework.http.ResponseEntity;

public interface IRestaurantController {
    ResponseEntity<DtoRestaurant> getRestaurant(Long id);
    ResponseEntity<DtoRestaurant> postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    ResponseEntity<DtoRestaurant> updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU);
    ResponseEntity<DtoRestaurant> deleteRestaurant(Long id);
}
