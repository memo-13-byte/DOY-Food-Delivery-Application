package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.OrderReview;
import org.hibernate.query.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderReviewRepository extends JpaRepository<OrderReview, Long> {
    @Query(nativeQuery = true, value = "SELECT * FROM reviews WHERE courier_id = ?1")
    List<OrderReview> findAllByCourierId(Long id);

    @Query(nativeQuery = true, value = "SELECT * FROM reviews WHERE restaurant_id = ?1")
    List<OrderReview> findAllByRestaurantId(Long id);

    @Query(nativeQuery = true, value = "SELECT * FROM reviews WHERE order_id = ?1")
    Optional<OrderReview> findByOrderId(Long id);
}
