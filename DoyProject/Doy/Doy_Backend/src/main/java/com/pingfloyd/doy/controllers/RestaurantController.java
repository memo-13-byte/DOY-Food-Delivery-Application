package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.DtoRestaurant;
import com.pingfloyd.doy.entities.DtoRestaurantIU;
import com.pingfloyd.doy.entities.Item;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController implements IRestaurantController {

    @Override
    @GetMapping("/get/{id}")
    public DtoRestaurant getRestaurant(@PathVariable(name = "id") int id) {
        return null;
    }

    @Override
    @PostMapping("/post")
    public DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU) {
        return null;
    }

    @Override
    @PutMapping("/update/{id}")
    public DtoRestaurant updateRestaurant(@PathVariable(name = "id") int id, DtoRestaurantIU dtoRestaurantIU) {
        return null;
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public DtoRestaurant deleteRestaurant(@PathVariable(name = "id") int id) {
        return null;
    }
}
