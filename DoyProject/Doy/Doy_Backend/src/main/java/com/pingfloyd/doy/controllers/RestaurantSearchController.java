package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.services.RestaurantSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/restaurant")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantSearchController {
    private final RestaurantSearchService restaurantService;
    @Autowired
    public RestaurantSearchController(RestaurantSearchService restaurantService){
        this.restaurantService = restaurantService;
    }
    /*
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantRequest>> searchRestaurantsByName(@RequestParam("name") String name){
        List<RestaurantRequest> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }
    */
    @GetMapping("/search")
    public ResponseEntity<Page<RestaurantRequest>> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Float minRating,
            @RequestParam(required = false) Double maxMinOrderPrice,
            @RequestParam(required = false) String cuisine,
            @RequestParam(defaultValue = "0") int page, // Default page is 0
            @RequestParam(defaultValue = "10") int size, // Default size 10 (can match service default)
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortDirection // Default sort ASC
    ) {
        Page<RestaurantRequest> restaurantPage = restaurantService.searchRestaurants(
                name, minRating, maxMinOrderPrice, cuisine,
                page, size, sortBy, sortDirection
        );
        return ResponseEntity.ok(restaurantPage); // Return the whole Page object
    }

}
