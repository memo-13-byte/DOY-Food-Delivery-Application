package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.enums.Allergens;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Set;
@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCustomer extends DtoUser {
    //private Set<Restaurant> favoriteRestaurants;
    //private Set<Address> addresses;
    //private Cart cart;
    @Valid
    private Address current_address;

    List<Allergens> allergens;
    //private Set<PaymentInfo> paymentInfos;

}
