package com.pingfloyd.doy.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "courier_request")
@Getter
@Setter
public class CourierRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private CustomerOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id")
    private Courier courier;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "estimated_distance")
    private Double estimatedDistance;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    // Default constructor
    public CourierRequest() {
    }

    // Constructor with essential fields
    public CourierRequest(CustomerOrder order) {
        this.order = order;

    }

    public void acceptRequest(Courier courier) {
        this.courier = courier;
        this.acceptedAt = LocalDateTime.now();

        this.order.setCourier(courier);
    }


}