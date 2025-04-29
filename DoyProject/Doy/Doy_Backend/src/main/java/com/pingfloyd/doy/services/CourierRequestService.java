package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.CourierRequest;
import com.pingfloyd.doy.exception.CourierRequestNotFoundException;
import com.pingfloyd.doy.exception.UserNotFoundException;
import com.pingfloyd.doy.repositories.CourierRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourierRequestService {
    private final CourierRequestRepository courierRequestRepository;
    private final CourierService courierService;

    @Autowired
    public CourierRequestService(CourierRequestRepository courierRequestRepository, CourierService courierService){
        this.courierRequestRepository = courierRequestRepository;
        this.courierService = courierService;
    }

    public void SaveRequest(CourierRequest request){
        courierRequestRepository.save(request);
    }
    public void DeleteRequest(CourierRequest request){
        courierRequestRepository.delete(request);
    }
    public List<CourierRequest> GetCourierRequests(Long courierId){
        Optional<Courier> courier = courierService.GetCourierById(courierId);
        if(courier.isEmpty()){
            throw new UserNotFoundException("Courier with given id cannot be found!");
        }
        return courierRequestRepository.findCourierRequestsByCourier(courier.get());
    }

    public CourierRequest GetCourierRequestById(Long requestId){
        Optional<CourierRequest> request = courierRequestRepository.findCourierRequestByRequestId(requestId);
        if(request.isEmpty()){
            throw new CourierRequestNotFoundException("Courier request with given id cannot be found!");
        }
        return request.get();
    }
}
