package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.services.RestaurantSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/restaurant")
public class RestaurantSearchController {
    private final RestaurantSearchService restaurantService;
    @Autowired
    public RestaurantSearchController(RestaurantSearchService restaurantService){
        this.restaurantService = restaurantService;
    }
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantRequest>> searchRestaurantsByName(@RequestParam("name") String name){
        List<RestaurantRequest> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }

}
