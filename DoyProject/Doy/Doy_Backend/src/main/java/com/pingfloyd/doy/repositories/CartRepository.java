package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Cart;
import com.pingfloyd.doy.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart , Long> {

    List<Cart> findCartsByRestaurant(Restaurant restaurant);

}
