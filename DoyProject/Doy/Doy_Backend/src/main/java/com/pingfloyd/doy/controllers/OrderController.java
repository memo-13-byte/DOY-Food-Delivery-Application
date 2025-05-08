package com.pingfloyd.doy.controllers;


import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.User;
import com.pingfloyd.doy.services.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;
    private final User user;

    @Autowired
    public OrderController(OrderService orderService, User user) {
        this.orderService = orderService;
        this.user = user;
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
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return ResponseEntity.ok(orderService.AddItemToCart(username ,itemId));
    }
    @GetMapping("/remove")
    public ResponseEntity<Boolean> RemoveItemFromCart(@RequestParam Long itemId){
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return ResponseEntity.ok(orderService.RemoveItemFromCart(username, itemId));
    }
    @GetMapping("/confirm")
    public ResponseEntity<Boolean>  ConfirmCart(){
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return ResponseEntity.ok(orderService.ConfirmCart(username));
    }
    @PostMapping("/payment")
    public ResponseEntity<Boolean> ConfirmOrder(@Valid @RequestBody DtoPaymentInformationIU dtoPaymentInformationIU){
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        return ResponseEntity.ok(orderService.ConfirmOrder(dtoPaymentInformationIU , username));
    }
    @GetMapping("/cart")
    public ResponseEntity<UserCartDTO> getCustomerCart() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
            UserCartDTO cartDto = orderService.getCurrentUserCart(username);
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

    @GetMapping("/courier/{courierId}/order")
    public ResponseEntity<DtoRestaurantOrders> GetCourierOrders(@PathVariable Long courierId){
        return ResponseEntity.ok(orderService.GetCourierOrders(courierId));
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

    @GetMapping("/details/get-user-info/{id}")
    public ResponseEntity<DtoOrderUserInformation> GetOrderUserInformation(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(orderService.GetOrderUserInformation(id));
    }





}
