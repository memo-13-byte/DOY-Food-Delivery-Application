package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/registration")
public class RegistrationController {

    private final RegistrationService registrationService;

    @Autowired
    public RegistrationController(RegistrationService registrationService){
        this.registrationService  = registrationService;
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody com.example.fooddelivery.registeration.RegistrationRequest request){
        try {
            User createdRestaurant = registrationService.CustomerRegister(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRestaurant);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("faileddd");
        }
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
