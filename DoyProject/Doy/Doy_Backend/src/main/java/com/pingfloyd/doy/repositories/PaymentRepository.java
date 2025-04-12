package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.PaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentInfo , Long> {

}
