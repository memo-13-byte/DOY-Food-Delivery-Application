package com.pingfloyd.doy.dto;


import com.pingfloyd.doy.enums.CityEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DtoDistrict {
    @Enumerated(EnumType.STRING)
    private CityEnum city;

    private String district;
}
