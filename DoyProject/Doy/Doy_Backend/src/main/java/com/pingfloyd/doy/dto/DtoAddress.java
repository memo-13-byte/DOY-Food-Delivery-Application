package com.pingfloyd.doy.dto;

import com.pingfloyd.doy.enums.CityEnum;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DtoAddress {

    @NotNull(message = "City can not be empty!")
    @Enumerated
    private CityEnum city;

    @NotBlank(message = "Neighborhood can not be empty!")
    @Size( min = 2 , message = "Neighborhood length must be at least 2!")
    private String neighborhood;

    @NotBlank(message = "District can not be empty!")
    @Size( min = 3 , message = "District length must be at least 3!")
    private String district;

    private String avenue;
    private String street;

    @NotNull(message = "Building number can not be empty!")
    @Min(value = 0, message = "Building number cannot be negative.")
    private Integer buildingNumber;

    @NotNull(message = "Apartment number can not be empty!")
    @Min(value = 0, message = "Apartment number cannot be negative.")
    private Integer apartmentNumber;
}
