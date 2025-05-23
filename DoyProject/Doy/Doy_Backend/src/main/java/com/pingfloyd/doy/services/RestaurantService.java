package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoRestaurant;
import com.pingfloyd.doy.dto.DtoRestaurantIU;
import com.pingfloyd.doy.dto.RestaurantRequest;
import com.pingfloyd.doy.entities.*;
import com.pingfloyd.doy.enums.RestaurantCategory;
import com.pingfloyd.doy.exception.RestaurantNotFoundException;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.CustomerRepository;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantService implements IRestaurantService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private UserService userService;

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
        dtoRestaurant.setImageId(restaurant.getImage() == null ? null : restaurant.getImage().getId());
        return dtoRestaurant;
    }



    @Override
    public DtoRestaurant postRestaurant(DtoRestaurantIU dtoRestaurantIU) {

        Restaurant restaurant = new Restaurant();
        BeanUtils.copyProperties(dtoRestaurantIU, restaurant);

        restaurant.setOpeningHour(dtoRestaurantIU.getOpeningHour());
        restaurant.setClosingHour(dtoRestaurantIU.getClosingHour());

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);

        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(savedRestaurant, dtoRestaurant);
        dtoRestaurant.setImageId(restaurant.getImage() == null ? null : restaurant.getImage().getId());
        return dtoRestaurant;
    }

    public void SaveRestaurant(Restaurant restaurant){
        restaurantRepository.save(restaurant);
    }

    @Override
    public DtoRestaurant updateRestaurant(Long id, DtoRestaurantIU dtoRestaurantIU) throws RestaurantNotFoundException {
        Restaurant restaurant = findRestaurantById(id);

        BeanUtils.copyProperties(dtoRestaurantIU, restaurant);

        restaurant.setOpeningHour(dtoRestaurantIU.getOpeningHour());
        restaurant.setClosingHour(dtoRestaurantIU.getClosingHour());

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(savedRestaurant, dtoRestaurant);
        dtoRestaurant.setImageId(restaurant.getImage() == null ? null : restaurant.getImage().getId());
        return dtoRestaurant;
    }

    @Override
    public DtoRestaurant deleteRestaurant(Long id) throws RestaurantNotFoundException {
        Restaurant restaurant = findRestaurantById(id);

        restaurantRepository.delete(restaurant);
        DtoRestaurant dtoRestaurant = new DtoRestaurant();
        BeanUtils.copyProperties(restaurant, dtoRestaurant);
        dtoRestaurant.setImageId(restaurant.getImage() == null ? null : restaurant.getImage().getId());
        return dtoRestaurant;
    }

    @Override
    public List<DtoRestaurant> gelAllRestaurants() {
        List<Restaurant> restaurantList = restaurantRepository.findAll();
        List<DtoRestaurant> dtoRestaurantList = new ArrayList<>();
        for (Restaurant restaurant : restaurantList) {
            DtoRestaurant dtoRestaurant = new DtoRestaurant();
            BeanUtils.copyProperties(restaurant, dtoRestaurant);
            dtoRestaurant.setImageId(restaurant.getImage() == null ? null : restaurant.getImage().getId());
            dtoRestaurantList.add(dtoRestaurant);
        }

        return dtoRestaurantList;
    }

    public Boolean getFavoriteRestaurant(String username, Long restaurantId) throws UserNotFoundException, RestaurantNotFoundException {
        Customer customer = userService.SearchCustomer(username);
        if(customer == null){
            throw new UserNotFoundException("User with given email doesn't exist!");
        }
        Restaurant restaurant = this.findRestaurantById(restaurantId);
        return customer.getFavoriteRestaurants().contains(restaurant);
    }

    public List<RestaurantRequest> getCustomerFavorites(String username) {
        Customer customer = userService.SearchCustomer(username);
        if(customer == null) {
            throw new UserNotFoundException("User with given email doesn't exist!");
        }
        return customer.getFavoriteRestaurants().stream()
                .map(RestaurantRequest::new)
                .collect(Collectors.toList());
    }

    public Boolean setFavoriteRestaurant(String username, Long restaurantId) throws UserNotFoundException, RestaurantNotFoundException {
        Customer customer = userService.SearchCustomer(username);
        if(customer == null) {
            throw new UserNotFoundException("User with given email doesn't exist!");
        }
        Restaurant restaurant = this.findRestaurantById(restaurantId);
        if(customer.getFavoriteRestaurants().contains(restaurant)) {
            customer.getFavoriteRestaurants().remove(restaurant);
        } else {
            customer.getFavoriteRestaurants().add(restaurant);
        }
        customerRepository.save(customer);
        return customer.getFavoriteRestaurants().contains(restaurant);
    }

    public RestaurantCategory[] GetCategories(){
        return RestaurantCategory.values();
    }
}
