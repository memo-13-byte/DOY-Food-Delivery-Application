package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.entities.GovernmentId;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCourier extends DtoUser{
    private String governmentId;
    private String districtCity;
    private String districtName;
    private Double rating;
    private Long ratingCount;
}
