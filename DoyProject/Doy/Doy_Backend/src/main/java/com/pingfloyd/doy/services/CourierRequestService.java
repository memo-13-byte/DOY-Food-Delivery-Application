package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.CourierRequest;
import com.pingfloyd.doy.enums.RequestStatus;
import com.pingfloyd.doy.repositories.CourierRepository;
import com.pingfloyd.doy.repositories.CourierRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CourierRequestService {

    @Autowired
    private CourierRequestRepository courierRequestRepository;
    @Autowired
    private CourierRepository courierRepository;
    /**
     * Process a courier accepting a request.
     * This will update the accepted request and expire all other pending requests for the same order.
     */
    public CourierRequest acceptRequest(Long requestId, Long courierId) {
        // Get the request to be accepted
        CourierRequest request = courierRequestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request not found"));

        // Validate the request is still pending
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Request is no longer pending");
        }

        // Get the courier
        Courier courier = courierRepository.findById(courierId)
                .orElseThrow(() -> new EntityNotFoundException("Courier not found"));

        // Begin transaction
        // Accept this request
        request.acceptRequest(courier);
        courierRequestRepository.save(request);

        // Find all other pending requests for the same order and expire them
        List<CourierRequest> otherRequests = courierRequestRepository.findByOrderAndStatusAndRequestIdNot(
                request.getOrder(), RequestStatus.PENDING, requestId);

        for (CourierRequest otherRequest : otherRequests) {
            otherRequest.expireRequest();
            courierRequestRepository.save(otherRequest);
        }
        return request;
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    public void expireOldRequests() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(10); // Example: 10-minute expiration
        List<CourierRequest> expiredRequests = courierRequestRepository.findByStatusAndCreatedAtBefore(
                RequestStatus.PENDING, cutoffTime);

        for (CourierRequest request : expiredRequests) {
            request.expireRequest();
            courierRequestRepository.save(request);
            // Optionally notify couriers that these requests are expired
        }
    }

}