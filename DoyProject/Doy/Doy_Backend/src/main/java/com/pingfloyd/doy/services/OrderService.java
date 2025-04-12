package com.pingfloyd.doy.services;


import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.HashSet;
import java.util.Set;

@Service
public class OrderService {
    private final RestaurantService restaurantService;
    private final ItemService itemService;
    private final UserService userService;
    private final CartService cartService;

    @Autowired
    public OrderService(RestaurantService restaurantService , ItemService itemService, UserService userService, CartService cartService){
        this.restaurantService = restaurantService;
        this.itemService = itemService;
        this.userService = userService;
        this.cartService = cartService;
    }

    public Cart AddItemToCart(String username, Long itemId){
        Customer customer = userService.SearchCustomer(username);
        MenuItem menuItem = itemService.getItemById(itemId);
        CartItem _item = null;
        if(customer != null && menuItem !=null){
            Cart userCart = customer.getCart();
            if(userCart == null){
                customer.setCart(cartService.CreateCart(customer));
                userCart = customer.getCart();
            }
            _item = TraverseCart(userCart , menuItem);
            if(_item == null){
                _item = cartService.CreateCartItem(userCart , menuItem);
                userCart.getItems().add(_item);
            }
            else{
                _item.setQuantity(_item.getQuantity()+1);
            }
            //cartService.SaveCartItem(_item);
            cartService.SaveCart(userCart);
            return userCart;
        }
        else{
            //Throw exception
            return null;
        }
    }
    public Cart RemoveItemFromCart(String username , Long itemId){
        Customer customer = userService.SearchCustomer(username);
        MenuItem menuItem = itemService.getItemById(itemId);
        if(customer != null && menuItem != null){
            Cart userCart = customer.getCart();
            if(userCart == null){
                //Throw exception
                return null;
            }
            CartItem item = TraverseCart(userCart , menuItem);
            if(item != null){
                item.setQuantity(item.getQuantity()-1);
                if(item.getQuantity() == 0){
                    userCart.getItems().remove(item);
                    return userCart;
                }
                cartService.SaveCart(userCart);
                return userCart;
            }
        }
        //Throw Exception
        return null;
    }

    private CartItem TraverseCart(Cart cart , MenuItem menuItem){
        Set<CartItem> set = cart.getItems();
        for(CartItem item: set){
            if(item.getMenuItem() == menuItem){
                return item;
            }
        }
        return  null;
    }
}
