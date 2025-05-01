package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.entities.GovernmentId;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class DtoCourierIU extends DtoUserIU{
    private String governmentId;
    @Valid
    private DtoDistrict district;
}
