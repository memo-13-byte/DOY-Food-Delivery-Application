package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.CustomerOrder;
import com.pingfloyd.doy.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Long> {
    List<CustomerOrder> findByCourierAndStatus(Courier courier, OrderStatus status);
}
