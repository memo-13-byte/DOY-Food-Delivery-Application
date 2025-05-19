package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.exception.RestaurantNotFoundException;
import com.pingfloyd.doy.repositories.CartItemRepository;
import com.pingfloyd.doy.repositories.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final RestaurantOwnerService restaurantOwnerService;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, RestaurantOwnerService restaurantOwnerService){
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;

        this.restaurantOwnerService = restaurantOwnerService;
    }
    public Cart CreateCart(Customer customer , Restaurant restaurant){
        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setRestaurant(restaurant);
        cartRepository.save(cart);
        return cart;
    }
    public CartItem CreateCartItem(Cart cart , MenuItem item){
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setMenuItem(item);
        cartItem.setQuantity(1);
        cartItemRepository.save(cartItem);
        return cartItem;
    }
    public void SaveCart(Cart cart){
        if(cart != null){
            cartRepository.save(cart);
        }
    }
    public void SaveCartItem(CartItem cartItem){
        if(cartItem != null){
            cartItemRepository.save(cartItem);
        }
    }


    @Transactional
    public void CleanCartRestaurant(Long restaurantId){
        Optional<RestaurantOwner> restaurantOwner =restaurantOwnerService.GetOwnerById(restaurantId);
        if(restaurantOwner.isEmpty()){
            throw new RestaurantNotFoundException("Restaurant owner with given id cannot be found");
        }
        List<Cart> userCarts = cartRepository.findCartsByRestaurant(restaurantOwner.get().getRestaurant());
        for(Cart cart : userCarts){
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
