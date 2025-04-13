package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.dto.DtoPaymentInformationIU;
import com.pingfloyd.doy.dto.UserCartDTO;
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
@RequestMapping("/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/add")
    public ResponseEntity<Boolean> AddItemToCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.AddItemToCart("said562@hotmail.com" ,itemId));
    }
    @GetMapping("/remove")
    public ResponseEntity<Boolean> RemoveItemFromCart(@RequestParam Long itemId){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.RemoveItemFromCart("said562@hotmail.com", itemId));
    }
    @GetMapping("/confirm")
    public ResponseEntity<Boolean>  ConfirmCart(){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.ConfirmCart("said562@hotmail.com"));
    }
    @PostMapping("/payment")
    public ResponseEntity<Boolean> ConfirmOrder(@RequestBody DtoPaymentInformationIU dtoPaymentInformationIU){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.ConfirmOrder(dtoPaymentInformationIU , "said562@hotmail.com"));
    }
    @GetMapping("/cart")
    public ResponseEntity<UserCartDTO> getCustomerCart() {
        try {
            UserCartDTO cartDto = orderService.getCurrentUserCart("said562@hotmail.com");
            // Service method now returns empty DTO instead of throwing for not found cart
            return ResponseEntity.ok(cartDto);
        }
        // Catch specific exceptions if your service throws them (e.g., for customer not found)
        catch (Exception e) {
            System.err.println("Error fetching user cart in controller: " + e.getMessage());
            // Log the full stack trace
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }

}
