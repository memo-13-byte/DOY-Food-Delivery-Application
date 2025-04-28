package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import com.pingfloyd.doy.entities.CourierRequest;
import com.pingfloyd.doy.entities.CustomerOrder;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.exception.RestaurantNotFoundException;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService implements IRestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant findRestaurantById(Long id) {
        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) {
            throw new RestaurantNotFoundException("Requested restaurant was not found");
        }
        return optionalRestaurant.get();
    }

    @Override
    public DtoRestaurant getRestaurant(Long id) throws RestaurantNotFoundException {
        Restaurant restaurant = findRestaurantById(id);
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

    public void SaveRestaurant(Restaurant restaurant){
        restaurantRepository.save(restaurant);
    }

    @Override
    public DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU) throws RestaurantNotFoundException {
        Restaurant restaurant = findRestaurantById(id);

        BeanUtils.copyProperties(dtoRestaurantIU, restaurant);
        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(savedRestaurant, dtoRestaurant);
        return dtoRestaurant;
    }

    @Override
    public DtoRestaurant deleteRestaurant(Long id) throws RestaurantNotFoundException {
        Restaurant restaurant = findRestaurantById(id);

        restaurantRepository.delete(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(restaurant, dtoRestaurant);
        return dtoRestaurant;
    }

    @Override
    public List<DtoRestaurant> gelAllRestaurants() {
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        List<DtoRestaurant> dtoRestaurantList = new ArrayList<>();
        for (Restaurant restaurant : restaurantList) {
            DtoRestaurant dtoRestaurant = new DtoRestaurant();
            BeanUtils.copyProperties(restaurant, dtoRestaurant);
            dtoRestaurantList.add(dtoRestaurant);
        }

        return dtoRestaurantList;
    }


}
