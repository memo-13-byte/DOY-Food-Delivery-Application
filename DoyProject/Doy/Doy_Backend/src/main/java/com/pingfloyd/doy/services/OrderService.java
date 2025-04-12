package com.pingfloyd.doy.services;


import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.entities.CartItem;
import com.pingfloyd.doy.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
public class OrderService {
    private final RestaurantService restaurantService;
    private final ItemService itemService;

    @Autowired
    public OrderService(RestaurantService restaurantService , ItemService itemService){
        this.restaurantService = restaurantService;
        this.itemService = itemService;
    }

/*
    public String AddItemToCart(String username, ){

    }
*/

}
