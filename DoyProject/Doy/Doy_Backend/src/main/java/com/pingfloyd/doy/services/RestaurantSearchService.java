package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantSearchService {
    private final RestaurantRepository restaurantRepository;
    private final int DataLimit = 10;

    @Autowired
    public RestaurantSearchService(RestaurantRepository restaurantRepository){
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional
    public List<RestaurantRequest> searchRestaurantsByName(String name){
        if (name == null || name.trim().isEmpty()) {
            return List.of();
        }
        Pageable limit = PageRequest.of(0 , DataLimit );
        List<Restaurant> restaurants = restaurantRepository.findByRestaurantNameContainingIgnoreCase(name.trim() , limit);
        return restaurants.stream()
                .map(RestaurantRequest::new) // Uses the constructor RestaurantDTO(Restaurant restaurant)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<RestaurantRequest> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantRequest::new)
                .collect(Collectors.toList());
    }





}
