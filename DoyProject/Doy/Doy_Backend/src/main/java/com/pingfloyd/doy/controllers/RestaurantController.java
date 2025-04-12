package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import com.pingfloyd.doy.services.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurant")
@CrossOrigin(origins = "http://localhost:3000")
public class RestaurantController implements IRestaurantController {

    @Autowired
    private RestaurantService restaurantService;

    @Override
    @GetMapping("/get/{id}")
    public ResponseEntity<DtoRestaurant> getRestaurant(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurant(id));
    }

    @Override
    @PostMapping("/post")
    public ResponseEntity<DtoRestaurant> postRestaurant(@RequestBody @Valid DtoRestaurantIU dtoRestaurantIU) {
        return ResponseEntity.ok(restaurantService.postRestaurant(dtoRestaurantIU));
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoRestaurant> updateRestaurant(@PathVariable(name = "id") Long id, @RequestBody @Valid DtoRestaurantIU dtoRestaurantIU) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, dtoRestaurantIU));
    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DtoRestaurant> deleteRestaurant(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(restaurantService.deleteRestaurant(id));
    }
}
