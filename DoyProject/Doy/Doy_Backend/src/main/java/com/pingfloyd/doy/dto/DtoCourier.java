package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.entities.GovernmentId;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCourier extends DtoUser{
    private GovernmentId governmentId;
    private District district;
    private Boolean isAvailable;
}
