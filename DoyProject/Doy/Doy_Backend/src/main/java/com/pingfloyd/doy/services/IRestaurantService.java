package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoRestaurant;
import com.pingfloyd.doy.entities.DtoRestaurantIU;
import com.pingfloyd.doy.entities.Item;
import org.springframework.web.multipart.MultipartFile;

public interface IRestaurantService {
    DtoRestaurant getRestaurant(int id);
    DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant updateRestaurant(int id, DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant deleteRestaurant(int id);
}
