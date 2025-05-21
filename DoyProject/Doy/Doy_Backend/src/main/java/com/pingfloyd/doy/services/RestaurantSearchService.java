package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.other.RestaurantSpecification;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
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



    @Transactional()
    public Page<RestaurantRequest> searchRestaurants(
            String name, Float minRating, Double maxMinOrderPrice, String cuisine,
            int page, int size, String sortBy, String sortDirection) {

        Specification<Restaurant> spec = RestaurantSpecification.filterBy(
                name, minRating, maxMinOrderPrice, cuisine
        );
        int pageSize = (size <= 0) ? DataLimit : size;
        int pageNum = Math.max(page, 0);
        Sort sort = Sort.unsorted(); // Default: no sorting
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Sort.Direction direction = Sort.Direction.ASC; // Default direction
            if (sortDirection != null && sortDirection.trim().equalsIgnoreCase("DESC")) {
                direction = Sort.Direction.DESC;
            }
            try {
                sort = Sort.by(direction, sortBy.trim());
            } catch (Exception e) {
                System.err.println("Warning: Invalid sort field provided: " + sortBy);
            }
        }

        Pageable pageable = PageRequest.of(pageNum, pageSize, sort);
        Page<Restaurant> restaurantPage = restaurantRepository.findAll(spec, pageable);
        return restaurantPage.map(RestaurantRequest::new); // Built-in map function for Page
    }


    /*
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
    */
    @Transactional
    public List<RestaurantRequest> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantRequest::new)
                .collect(Collectors.toList());
    }





}
