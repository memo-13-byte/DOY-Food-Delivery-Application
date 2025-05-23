package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.*;
import com.pingfloyd.doy.entities.Courier;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IUserService {
    List<DtoUser> getAllUsers();
    List<DtoRestaurantOwner> getAllRestaurantOwners();
    List<DtoCourier> getAllCouriers();
    List<DtoCustomer> getAllCustomers();

    DtoUser getUserById(Long id);

    DtoUser getUserByEmail(String email);
    DtoCustomer getCustomerByEmail(String email);
    DtoRestaurantOwner getRestaurantOwnerByEmail(String email);
    DtoCourier getCourierByEmail(String email);

    DtoCustomer putCustomer(String email, DtoCustomerIU dtoCustomerIU);
    DtoCourier putCourier(String email, DtoCourierIU dtoCourierIU);
    DtoRestaurantOwner putRestaurantOwner(String email, DtoRestaurantOwnerIU dtoRestaurantOwnerIU);
    boolean checkIfSameUserFromToken(Long id);
}
