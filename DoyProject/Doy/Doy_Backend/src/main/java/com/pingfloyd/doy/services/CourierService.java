package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.CourierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
public class CourierService {
    CourierRepository courierRepository;

    @Autowired
    public CourierService(CourierRepository courierRepository){
        this.courierRepository = courierRepository;
    }

    public Optional<Courier> GetByGovernmentId(String governmentId){
        return courierRepository.findByGovernmentId(governmentId);
    }

    public Set<Courier> GetCouriersByDistrict(District district){
        return courierRepository.findCouriersByDistrict(district);
    }
    public Set<Courier> GetPendingCouriers(){
        return courierRepository.findCouriersByIsEnabledFalse();
    }

    public Courier SetAvailability(String email,Boolean availability){

        Optional<Courier> courier = courierRepository.findByEmail(email);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given email doesn't exist!");
        }
        Courier c = courier.get();
        c.setIsAvailable(availability);
        return courierRepository.save(c);
    }
}
