package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.CourierRequest;
import com.pingfloyd.doy.entities.CustomerOrder;
import com.pingfloyd.doy.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CourierRequestRepository extends JpaRepository<CourierRequest, Long> {
    List<CourierRequest> findByOrderAndStatusAndRequestIdNot(CustomerOrder order, RequestStatus status, Long requestId);
    List<CourierRequest> findByStatusAndCreatedAtBefore(RequestStatus status, LocalDateTime cutoffTime);

}