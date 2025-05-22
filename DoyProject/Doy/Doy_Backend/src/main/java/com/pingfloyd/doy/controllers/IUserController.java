package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.Courier;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IUserController {
    ResponseEntity<DtoUser> getUserById(Long id);

    ResponseEntity<DtoUser> getUserByEmail(String email);
    ResponseEntity<DtoCustomer> getCustomerByEmail(String email);
    ResponseEntity<DtoRestaurantOwner> getRestaurantOwnerByEmail(String email);
    ResponseEntity<DtoCourier> getCourierByEmail(String email);

    ResponseEntity<DtoCustomer> putCustomer(String email, DtoCustomerIU dtoCustomerIU);
    ResponseEntity<DtoCourier> putCourier(String email, DtoCourierIU dtoCourierIU);
    ResponseEntity<DtoRestaurantOwner> putRestaurantOwner(String email, DtoRestaurantOwnerIU dtoRestaurantOwnerIU);


}
