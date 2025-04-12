package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.repositories.CartItemRepository;
import com.pingfloyd.doy.repositories.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository){
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
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
}
