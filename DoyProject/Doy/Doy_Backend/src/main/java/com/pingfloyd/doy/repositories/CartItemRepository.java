package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem , Long> {
}
