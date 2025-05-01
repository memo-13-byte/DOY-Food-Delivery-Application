package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;
@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCustomer extends DtoUser {
    private Set<Restaurant> favoriteRestaurants;
    private Set<Address> addresses;
    private Cart cart;
    private Address current_address;
    private Set<PaymentInfo> paymentInfos;

}
