package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart , Long> {

}
