package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.*;

import java.util.Set;

public class DtoCustomer extends DtoUser {
    private Set<Restaurant> favoriteRestaurants;
    private Set<Address> addresses;
    private Cart cart;
    private Address current_address;
    private Set<PaymentInfo> paymentInfos;

}
