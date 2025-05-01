package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.GovernmentId;
import com.pingfloyd.doy.entities.Restaurant;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DtoRestaurantOwnerIU extends DtoUserIU{
    private String governmentId;
    //private Restaurant restaurant;
}
