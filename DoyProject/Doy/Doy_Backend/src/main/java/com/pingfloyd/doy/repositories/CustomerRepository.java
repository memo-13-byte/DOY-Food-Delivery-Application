package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // If you use Long IDs instead of UUID, change String to Long
}