package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.CourierRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourierRequestRepository extends JpaRepository<CourierRequest , Long> {

    List<CourierRequest> findCourierRequestsByCourier(Courier courier);
    Optional<CourierRequest> findCourierRequestByRequestId(Long id);
}
