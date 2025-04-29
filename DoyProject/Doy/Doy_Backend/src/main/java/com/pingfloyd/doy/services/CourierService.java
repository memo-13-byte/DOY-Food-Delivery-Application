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
    public Optional<Courier> GetCourierById(Long id){
        return courierRepository.findCourierById(id);
    }
    public Set<Courier> GetCouriersByDistrict(District district){
        return courierRepository.findCouriersByDistrict(district);
    }

    public Set<Courier> GetAvailableCouriersByDistrict(District district){
        return courierRepository.findCouriersByDistrictAndIsAvailableTrue(district);
    }

    public Set<Courier> GetPendingCouriers(){
        return courierRepository.findCouriersByIsEnabledFalse();
    }

    public Boolean GetCourierAvailability(Long id){
        Optional<Courier> courier = courierRepository.findById(id);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given email doesn't exist!");
        }
        return courier.get().getIsAvailable();

    }
    public void SetAvailability(Long id,Boolean availability){
        Optional<Courier> courier = courierRepository.findById(id);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given email doesn't exist!");
        }
        Courier c = courier.get();
        c.setIsAvailable(availability);
    }

}
