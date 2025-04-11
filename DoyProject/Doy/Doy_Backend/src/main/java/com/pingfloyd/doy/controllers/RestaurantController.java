package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import com.pingfloyd.doy.services.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController implements IRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Override
    @GetMapping("/get/{id}")
    public DtoRestaurant getRestaurant(@PathVariable(name = "id") Long id) {
        return restaurantService.getRestaurant(id);
    }

    @Override
    @PostMapping("/post")
    public DtoRestaurant postRestaurant(@RequestBody DtoRestaurantIU dtoRestaurantIU) {
        return restaurantService.postRestaurant(dtoRestaurantIU);
    }

    @Override
    @PutMapping("/update/{id}")
    public DtoRestaurant updateRestaurant(@PathVariable(name = "id") Long id, @RequestBody DtoRestaurantIU dtoRestaurantIU) {
        return restaurantService.updateRestaurant(id, dtoRestaurantIU);
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public DtoRestaurant deleteRestaurant(@PathVariable(name = "id") Long id) {
        return restaurantService.deleteRestaurant(id);
    }
}
