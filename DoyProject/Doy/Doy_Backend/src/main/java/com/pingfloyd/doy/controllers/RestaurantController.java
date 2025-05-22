package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.RestaurantService;
import com.pingfloyd.doy.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurant")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RestaurantController implements IRestaurantController {

    @Autowired
    private RestaurantService restaurantService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    @Override
    @GetMapping("/get/{id}")
    public ResponseEntity<DtoRestaurant> getRestaurant(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurant(id));
    }

    @Override
    @PutMapping("/update/{id}")
    public ResponseEntity<DtoRestaurant> updateRestaurant(@PathVariable(name = "id") Long id, @RequestBody @Valid DtoRestaurantIU dtoRestaurantIU) {
        if ((jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER) &&
        userService.checkIfSameUserFromToken(id)) || jwtService.checkIfUserRole(UserRoles.ADMIN))
            return ResponseEntity.ok(restaurantService.updateRestaurant(id, dtoRestaurantIU));
        throw new UnauthorizedRequestException();

    }

    @Override
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DtoRestaurant> deleteRestaurant(@PathVariable(name = "id") Long id) {
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(restaurantService.deleteRestaurant(id));
    }


    @Override
    @GetMapping("/get-all")
    public ResponseEntity<List<DtoRestaurant>> getAllRestaurants() {
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(restaurantService.gelAllRestaurants());
    }
}
