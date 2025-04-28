package com.pingfloyd.doy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantOwnerFullDto {

    @Valid
    private RestaurantOwnerRegistrationRequest userInfo;

    @Valid
    private DtoRestaurantIU restaurantInfo;

    @Valid
    private DtoAddress addressInfo;
}
