package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.PaymentInfo;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.Allergens;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Set;
@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCustomerIU extends DtoUserIU{
    //private Set<Restaurant> favoriteRestaurants;
    //private Set<Address> addresses;
    //private Cart cart;
    @Valid
    private DtoAddress current_address;

    List<Allergens> allergens;
    //private Set<PaymentInfo> paymentInfos;
}
