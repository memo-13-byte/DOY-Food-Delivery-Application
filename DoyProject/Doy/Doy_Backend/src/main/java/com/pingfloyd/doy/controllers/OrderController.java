package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
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
    public ResponseEntity<Boolean> ConfirmOrder(@Valid @RequestBody DtoPaymentInformationIU dtoPaymentInformationIU){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(orderService.ConfirmOrder(dtoPaymentInformationIU , "said562@hotmail.com"));
    }
    @GetMapping("/cart")
    public ResponseEntity<UserCartDTO> getCustomerCart() {
        try {
            UserCartDTO cartDto = orderService.getCurrentUserCart("said562@hotmail.com");
            return ResponseEntity.ok(cartDto);
        }
        catch (Exception e) {
            System.err.println("Error fetching user cart in controller: " + e.getMessage());
            return ResponseEntity.status(500).build(); // Internal Server Error
        }
    }

    @GetMapping("/restaurant/{restaurantId}/order")
    public ResponseEntity<DtoRestaurantOrders> GetRestaurantOrders(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.GetRestaurantOrders(restaurantId));
    }
    @GetMapping("/restaurant/{restaurantId}/couriers")
    public ResponseEntity<List<DtoCourierForOrder>> GetActiveCouriers(@PathVariable Long restaurantId){
        return ResponseEntity.ok(orderService.GetAvailableCouriersByDistrict(restaurantId));
    }

    @PostMapping("/restaurant/request/{orderId}/{courierId}")
    public ResponseEntity<Boolean> SendRequestToCourier(@PathVariable Long orderId , @PathVariable Long courierId){
        return ResponseEntity.ok(orderService.SendRequestToCourier(orderId , courierId));
    }
    @GetMapping("/courier/{courierId}/requests")
    public ResponseEntity<DtoCourierRequest> GetCourierRequests(@PathVariable Long courierId){
        return ResponseEntity.ok(orderService.GetCourierRequests(courierId));
    }
    @PutMapping("/courier/request{requestId}-{response}")
    public ResponseEntity<Boolean> CourierResponse(@PathVariable Long requestId,@PathVariable Boolean response){
        return ResponseEntity.ok(orderService.CourierResponse(requestId , response));
    }

    @PatchMapping("/{orderId}/state")
    public ResponseEntity<Void> processOrderState(
            @PathVariable Long orderId,
            @RequestBody DtoOrderStatus status
            ) {
        orderService.ProcessOrderState(orderId, status);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/courier/update/status/{id}-{status}")
    public ResponseEntity<Boolean> SetCourierAvailability(@PathVariable Long id , @PathVariable Boolean status){
        return ResponseEntity.ok(orderService.SetCourierAvailability(id , status));

    }
    @GetMapping("/courier/status/{id}")
    public ResponseEntity<Boolean> GetCourierAvailability(@PathVariable Long id){
        return ResponseEntity.ok(orderService.GetCourierAvailability(id));
    }

    @DeleteMapping("/cart/empty/{id}")
    public ResponseEntity<Boolean> ClearCartByRestaurant(@PathVariable Long id){
        return ResponseEntity.ok(orderService.ClearCartByRestaurant(id));
    }

    @GetMapping("/details/{orderId}")
    public ResponseEntity<DtoOrderDetails> GetOrderDetails(@PathVariable Long orderId){
        return ResponseEntity.ok(orderService.GetOrderDetails(orderId));
    }




}
