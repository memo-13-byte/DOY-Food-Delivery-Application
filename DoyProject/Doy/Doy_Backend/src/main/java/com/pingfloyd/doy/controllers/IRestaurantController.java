package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;

public interface IRestaurantController {
    DtoRestaurant getRestaurant(Long id);
    DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant deleteRestaurant(Long id);
}
