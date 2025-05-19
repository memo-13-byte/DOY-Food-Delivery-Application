package com.pingfloyd.doy.services;


import com.pingfloyd.doy.entities.Address;
import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.enums.CityEnum;
import com.pingfloyd.doy.repositories.AddressRepository;
import com.pingfloyd.doy.repositories.DistrictRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DistrictService
{
    private final DistrictRepository districtRepository;
    private final AddressRepository addressRepository;

    @Autowired
    public DistrictService(DistrictRepository districtRepository, AddressRepository addressRepository){
        this.districtRepository = districtRepository;
        this.addressRepository = addressRepository;
    }

    public District GetDistrict(CityEnum city , String district){
        return districtRepository.findByCityAndName(city,district).orElse(null);
    }

    public Address SaveAddress(Address address){
        return addressRepository.save(address);
    }
    public District SaveDistrict(District district){
        return districtRepository.save(district);
    }


}
