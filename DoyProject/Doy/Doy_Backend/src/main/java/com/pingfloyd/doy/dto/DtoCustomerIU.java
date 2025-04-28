package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.PaymentInfo;
import com.pingfloyd.doy.entities.Restaurant;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;
@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCustomerIU extends DtoUserIU{/*
    private Set<Restaurant> favoriteRestaurants;
    private Set<Address> addresses;
    private Cart cart;
    private Address current_address;
    private Set<PaymentInfo> paymentInfos;*/
}
