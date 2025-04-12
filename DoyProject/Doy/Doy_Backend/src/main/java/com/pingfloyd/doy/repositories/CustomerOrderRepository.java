package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder,Long> {
}
