package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoRestaurant;
import com.pingfloyd.doy.entities.DtoRestaurantIU;

public interface IRestaurantService {
    DtoRestaurant getRestaurant(Long id);
    DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant deleteRestaurant(Long id);
}
