package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.RestaurantOwner;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantOwnerRepository extends JpaRepository<RestaurantOwner, Long> {
    Optional<RestaurantOwner> findByEmail(String email);
}
