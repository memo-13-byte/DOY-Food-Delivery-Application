package com.pingfloyd.doy.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
public class DtoOrderDetails{
    private Long orderId;
    private List<DtoMenuItem> menuItems = new ArrayList<>();
    private String restaurantName;
    private DtoAddress customerAddress;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String note;
}

