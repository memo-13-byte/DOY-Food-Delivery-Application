package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/registration")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class RegistrationController {

    private final RegistrationService registrationService;
    private final JwtService jwtService;

    @Autowired
    public RegistrationController(RegistrationService registrationService, JwtService jwtService){
        this.registrationService  = registrationService;
        this.jwtService = jwtService;
    }

    @PostMapping()
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request){
        User createdRestaurant = registrationService.CustomerRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
    }
    @PostMapping("/restaurant")
    public ResponseEntity<?> restourantOwnerRegister(@Valid @RequestBody RestaurantOwnerFullDto request){
        User createdUser = registrationService.RestaurantOwnerRegister(request.getUserInfo() , request.getRestaurantInfo() , request.getAddressInfo());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PostMapping("/courier")
    public ResponseEntity<?> CourierRegister(@Valid @RequestBody CourierRegistrationRequest request){
        User createdUser = registrationService.CourierRegister(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/pending/{id}-{accept}")
    public ResponseEntity<Boolean> PendingRegister(@PathVariable Long id , @PathVariable Boolean accept){
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(registrationService.EnableUser(id , accept));
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> confirmUserAccount(@RequestParam("token") String token) {
        try {
            String result = registrationService.confirmToken(token);
            // Maybe return HTML or redirect instruction for better UX
            return ResponseEntity.ok(result);
        } catch (IllegalStateException e) {
            // Handle specific errors like token not found, expired, already confirmed
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Confirmation failed.");
        }
    }



}
