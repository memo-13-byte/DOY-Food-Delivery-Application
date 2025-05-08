package com.pingfloyd.doy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoOrderUserInformation {
    private Long courierId;
    private Long restaurantId;
    private Long customerId;
}
