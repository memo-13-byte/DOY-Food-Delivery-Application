package com.pingfloyd.doy.entities;

import com.pingfloyd.doy.enums.RequestStatus;
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

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_id")
    private Courier courier;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20, nullable = false)
    private RequestStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "estimated_distance")
    private Double estimatedDistance;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Column(name = "compensation")
    private Double compensation;

    @Column(name = "items_count")
    private Integer itemsCount;

    @Column(name = "special_instructions", length = 255)
    private String specialInstructions;

    @Column(name = "is_priority")
    private Boolean isPriority = false;

    // Default constructor
    public CourierRequest() {
    }

    // Constructor with essential fields
    public CourierRequest(CustomerOrder order, Restaurant restaurant, RequestStatus status) {
        this.order = order;
        this.restaurant = restaurant;
        this.status = status;
    }

    // Method to accept request by courier
    public void acceptRequest(Courier courier) {
        this.courier = courier;
        this.status = RequestStatus.ACCEPTED;
        this.acceptedAt = LocalDateTime.now();

        // Also update the order with the courier
        this.order.setCourier(courier);
    }

    // Method to reject request by courier
    public void rejectRequest(Courier courier) {
        this.courier = courier;
        this.status = RequestStatus.REJECTED;
        this.rejectedAt = LocalDateTime.now();
    }

    // Method to expire a request
    public void expireRequest() {
        this.status = RequestStatus.EXPIRED;
    }
}