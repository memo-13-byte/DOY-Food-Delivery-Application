package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Restaurant;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> , JpaSpecificationExecutor<Restaurant> {

    List<Restaurant> findByRestaurantNameContainingIgnoreCase(String name , Pageable pageable);
}

