package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @GetMapping("/me")
    public String testUser(){

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String name = "";
        if (principal instanceof UserDetails) {
            name = ((UserDetails) principal).getUsername();
        }
        else{
            name = principal.toString();
        }
        String lala = "abc";
        return name;
    }
    @GetMapping("/add")
    public ResponseEntity<Boolean> AddItemToCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.AddItemToCart(principal.toString() ,itemId));
    }
    @GetMapping("/remove")
    public ResponseEntity<Boolean> RemoveItemFromCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.RemoveItemFromCart(principal.toString() , itemId));
    }
    @GetMapping("/confirm")
    public ResponseEntity<Boolean>  ConfirmCart(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.ConfirmCart(principal.toString()));
    }
    @PostMapping("/payment")
    public ResponseEntity<Boolean> ConfirmOrder(@RequestBody @Valid DtoPaymentInformationIU dtoPaymentInformationIU){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.ConfirmOrder(dtoPaymentInformationIU , principal.toString()));
    }

}
