package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {


}
