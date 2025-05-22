package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController implements IUserController{
    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/get-admin-users")
    public ResponseEntity<List<DtoAdminUserManagement>> getAdminManagementUsers(){
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(userService.getAdminManagedUsers());
    }

    @Override
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<DtoUser> getUserById(@PathVariable(name = "id") Long id) {
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    @GetMapping("/get-by-email/{email}")
    public ResponseEntity<DtoUser> getUserByEmail(@PathVariable(name = "email") String email) {
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @Override
    @GetMapping("/customers/get-by-email/{email}")
    public ResponseEntity<DtoCustomer> getCustomerByEmail(@PathVariable(name = "email")String email) {
        if (jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.CUSTOMER))
            return ResponseEntity.ok(userService.getCustomerByEmail(jwtService.getUserEmail()));
        throw new UnauthorizedRequestException();

    }

    @Override
    @GetMapping("/restaurant-owners/get-by-email/{email}")
    public ResponseEntity<DtoRestaurantOwner> getRestaurantOwnerByEmail(@PathVariable(name = "email")String email) {
        if ((jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER))
                || jwtService.checkIfUserRole(UserRoles.ADMIN))
            return ResponseEntity.ok(userService.getRestaurantOwnerByEmail(email));
        throw new UnauthorizedRequestException();

    }

    @Override
    @GetMapping("/couriers/get-by-email/{email}")
    public ResponseEntity<DtoCourier> getCourierByEmail(@PathVariable(name = "email")String email) {
        if ((jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.COURIER)
                || jwtService.checkIfUserRole(UserRoles.ADMIN)))
            return ResponseEntity.ok(userService.getCourierByEmail(email));
        throw new UnauthorizedRequestException();

    }

    @Override
    @PutMapping("/customers/update/{email}")
    public ResponseEntity<DtoCustomer> putCustomer(@PathVariable(name = "email") String email, @RequestBody @Valid DtoCustomerIU dtoCustomerIU) {
        if ((jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.CUSTOMER))) return ResponseEntity.ok(userService.putCustomer(email, dtoCustomerIU));
        throw new UnauthorizedRequestException();

    }

    @Override
    @PutMapping("/couriers/update/{email}")
    public ResponseEntity<DtoCourier> putCourier(@PathVariable(name = "email") String email,@RequestBody @Valid DtoCourierIU dtoCourierIU) {
        if ((jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.COURIER)) ||
        jwtService.checkIfUserRole(UserRoles.ADMIN)) return ResponseEntity.ok(userService.putCourier(email, dtoCourierIU));
        throw new UnauthorizedRequestException();

    }

    @Override
    @PutMapping("/restaurant-owners/update/{email}")
    public ResponseEntity<DtoRestaurantOwner> putRestaurantOwner(@PathVariable(name = "email") String email,@RequestBody @Valid DtoRestaurantOwnerIU dtoRestaurantOwnerIU) {
        if (jwtService.getUserEmail().equals(email) && jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER)
        || jwtService.checkIfUserRole(UserRoles.ADMIN))
            return ResponseEntity.ok(userService.putRestaurantOwner(email, dtoRestaurantOwnerIU));
        throw new UnauthorizedRequestException();

    }

    @GetMapping("/pendings")
    public ResponseEntity<DtoPendingRegister> GetPendingRegisters(){
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
        return ResponseEntity.ok(userService.GetPendingRegisters());
    }

    @PutMapping("/suspend")
    public ResponseEntity<Boolean> SuspendUser(@RequestBody @Valid DtoBanRequest request){
        if (!jwtService.checkIfUserRole(UserRoles.ADMIN)) throw new UnauthorizedRequestException();
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
