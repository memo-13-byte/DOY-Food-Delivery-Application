package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.OrderStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class DtoOrderStatus {
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Boolean accept;
}
