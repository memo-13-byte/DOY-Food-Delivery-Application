package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.CustomerOrder;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Long> {
    List<CustomerOrder> findByCourierAndStatus(Courier courier, OrderStatus status);
    List<CustomerOrder> findCustomerOrdersByRestaurant(Restaurant restaurant);
    Optional<CustomerOrder> findCustomerOrderByCourier(Courier courier);
    Optional<CustomerOrder> findCustomerOrderByOrderId(Long id);

}
