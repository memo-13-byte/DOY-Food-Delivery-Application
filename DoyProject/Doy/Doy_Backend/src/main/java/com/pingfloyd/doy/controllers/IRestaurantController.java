package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.DtoRestaurant;
import com.pingfloyd.doy.entities.DtoRestaurantIU;
import com.pingfloyd.doy.entities.Item;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface IRestaurantController {
    DtoRestaurant getRestaurant(int id);
    DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant updateRestaurant(int id, DtoRestaurantIU dtoRestaurantIU);
    DtoRestaurant deleteRestaurant(int id);
}
