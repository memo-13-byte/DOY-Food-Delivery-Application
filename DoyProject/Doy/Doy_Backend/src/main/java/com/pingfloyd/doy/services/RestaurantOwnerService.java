package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.RestaurantOwner;
import com.pingfloyd.doy.repositories.CourierRepository;
import com.pingfloyd.doy.repositories.RestaurantOwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class RestaurantOwnerService{
    RestaurantOwnerRepository restaurantOwnerRepository;

    @Autowired
    public RestaurantOwnerService(RestaurantOwnerRepository restaurantOwnerRepository){
        this.restaurantOwnerRepository = restaurantOwnerRepository;
    }

    public Optional<RestaurantOwner> GetByGovernmentId(String governmentId){
        return restaurantOwnerRepository.findByGovernmentId(governmentId);
    }
    public Set<RestaurantOwner> GetPendingRestaurantOwners(){
        return restaurantOwnerRepository.findRestaurantOwnersByIsEnabledFalse();
    }
}
