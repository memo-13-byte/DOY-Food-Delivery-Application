package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.OrderStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Getter
@Setter
@NoArgsConstructor
public class DtoRestaurantOrders {

    List<OrderInfo> orderInfoList = new ArrayList<>();

    @Getter
    @Setter
    @NoArgsConstructor
    public static class OrderInfo {
        private Long orderId;
        private Long customerId;
        private String customerName;
        private String customerPhone;
        @Enumerated(EnumType.STRING)
        private OrderStatus status;
        private LocalDate creationDate;
        private Double price;
    }
}
