package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.DtoRestaurant;
import com.pingfloyd.doy.entities.DtoRestaurantIU;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RestaurantService implements IRestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant findRestaurantById(Long id) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        return optionalRestaurant.orElse(null);
    }

    @Override
    public DtoRestaurant getRestaurant(Long id) {
        Restaurant restaurant = findRestaurantById(id);
        if (restaurant == null) {
            return null;
        }
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(restaurant, dtoRestaurant);
        return dtoRestaurant;
    }

    @Override
    public DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU) {
        Restaurant restaurant = new Restaurant();
        BeanUtils.copyProperties(dtoRestaurantIU, restaurant);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(savedRestaurant, dtoRestaurant);
        return dtoRestaurant;
    }

    @Override
    public DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU) {
        Restaurant restaurant = findRestaurantById(id);
        if (restaurant == null) {
            return null;
        }
        BeanUtils.copyProperties(dtoRestaurantIU, restaurant);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(savedRestaurant, dtoRestaurant);
        return dtoRestaurant;
    }

    @Override
    public DtoRestaurant deleteRestaurant(Long id) {
        Restaurant restaurant = findRestaurantById(id);
        if (restaurant == null) {
            return null;
        }
        restaurantRepository.delete(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(restaurant, dtoRestaurant);
        return dtoRestaurant;
    }
}
