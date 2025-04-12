package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
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
    public Boolean AddItemToCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Cart cart = orderService.AddItemToCart(principal.toString() ,itemId);
        return cart != null;
    }
    @GetMapping("/remove")
    public Boolean RemoveItemFromCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Cart cart = orderService.RemoveItemFromCart(principal.toString() , itemId);
        return cart != null;
    }
}
