package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController implements IUserController{
    @Autowired
    private UserService userService;


    @Override
    @GetMapping("/get-all")
    public ResponseEntity<List<DtoUser>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Override
    @GetMapping("/get-all-restaurants")
    public ResponseEntity<List<DtoRestaurantOwner>> getAllRestaurantOwners() {
        return ResponseEntity.ok(userService.getAllRestaurantOwners());
    }

    @GetMapping("/get-admin-users")
    public ResponseEntity<List<DtoAdminUserManagement>> getAdminManagementUsers(){
        return ResponseEntity.ok(userService.getAdminManagedUsers());
    }



    @Override
    @GetMapping("/get-all-couriers")
    public ResponseEntity<List<DtoCourier>> getAllCouriers() {
        return ResponseEntity.ok(userService.getAllCouriers());
    }

    @Override
    @GetMapping("/get-all-customers")
    public ResponseEntity<List<DtoCustomer>> getAllCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }

    @Override
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<DtoUser> getUserById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<DtoUser> getUserByEmail(@PathVariable(name = "email") String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @Override
    @GetMapping("/customers/get-by-email/{email}")
    public ResponseEntity<DtoCustomer> getCustomerByEmail(@PathVariable(name = "email")String email) {
        return ResponseEntity.ok(userService.getCustomerByEmail(email));
    }

    @Override
    @GetMapping("/restaurant-owners/get-by-email/{email}")
    public ResponseEntity<DtoRestaurantOwner> getRestaurantOwnerByEmail(@PathVariable(name = "email")String email) {
        return ResponseEntity.ok(userService.getRestaurantOwnerByEmail(email));
    }

    @Override
    @GetMapping("/couriers/get-by-email/{email}")
    public ResponseEntity<DtoCourier> getCourierByEmail(@PathVariable(name = "email")String email) {
        return ResponseEntity.ok(userService.getCourierByEmail(email));
    }

    @Override
    @PutMapping("/customers/update/{email}")
    public ResponseEntity<DtoCustomer> putCustomer(@PathVariable(name = "email") String email, @RequestBody @Valid DtoCustomerIU dtoCustomerIU) {
        return ResponseEntity.ok(userService.putCustomer(email, dtoCustomerIU));
    }

    @Override
    @PutMapping("/couriers/update/{email}")
    public ResponseEntity<DtoCourier> putCourier(@PathVariable(name = "email") String email,@RequestBody @Valid DtoCourierIU dtoCourierIU) {
        return ResponseEntity.ok(userService.putCourier(email, dtoCourierIU));
    }

    @Override
    @PutMapping("/restaurant-owners/update/{email}")
    public ResponseEntity<DtoRestaurantOwner> putRestaurantOwner(@PathVariable(name = "email") String email,@RequestBody @Valid DtoRestaurantOwnerIU dtoRestaurantOwnerIU) {
        return ResponseEntity.ok(userService.putRestaurantOwner(email, dtoRestaurantOwnerIU));
    }

    @GetMapping("/pendings")
    public ResponseEntity<DtoPendingRegister> GetPendingRegisters(){
        return ResponseEntity.ok(userService.GetPendingRegisters());
    }

    @PutMapping("/suspend")
    public ResponseEntity<Boolean> SuspendUser(@RequestBody @Valid DtoBanRequest request){
        return ResponseEntity.ok(userService.SuspendUser(request));
    }

    @GetMapping("/forget-password/{email}")
    public ResponseEntity<Void> SendPasswordResetRequest(@PathVariable(name = "email") String email){
        userService.ResetPasswordRequest(email);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/reset-password")
    public ResponseEntity<Void> ResetPassword(@Valid @RequestBody ResetPasswordDto dto){
        userService.ResetPassword(dto);
        return ResponseEntity.ok().build();
    }


}
