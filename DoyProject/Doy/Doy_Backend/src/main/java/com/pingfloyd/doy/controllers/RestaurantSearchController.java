package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.enums.CityEnum;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.RestaurantSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/restaurant")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RestaurantSearchController {
    private final RestaurantSearchService restaurantService;
    private final JwtService jwtService;

    @Autowired
    public RestaurantSearchController(RestaurantSearchService restaurantService, JwtService jwtService){
        this.restaurantService = restaurantService;
        this.jwtService = jwtService;
    }
    /*
    @GetMapping("/search")
    public ResponseEntity<List<RestaurantRequest>> searchRestaurantsByName(@RequestParam("name") String name){
        List<RestaurantRequest> restaurants = restaurantService.searchRestaurantsByName(name);
        return ResponseEntity.ok(restaurants);
    }
    */
    @GetMapping("/search")
    public Page<RestaurantRequest> searchRestaurants(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Float minRating,
            @RequestParam(required = false) Double maxMinOrderPrice,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String districtName,
            @RequestParam(required = false) CityEnum city, // <--- ADD THIS PARAMETER
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        return restaurantService.searchRestaurants(
                name, minRating, maxMinOrderPrice, cuisine,
                districtName,
                city, // <--- PASS IT TO THE SERVICE METHOD
                page, size, sortBy, sortDirection
        );
    }

}
