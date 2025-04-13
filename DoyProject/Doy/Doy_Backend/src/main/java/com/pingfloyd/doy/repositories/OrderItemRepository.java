package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem , Long> {
}
