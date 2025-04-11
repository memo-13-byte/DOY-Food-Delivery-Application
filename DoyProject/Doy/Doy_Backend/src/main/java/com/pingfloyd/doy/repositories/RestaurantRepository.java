package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
}
