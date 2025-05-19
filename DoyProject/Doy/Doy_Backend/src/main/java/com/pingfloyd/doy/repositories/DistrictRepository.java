package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.enums.CityEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface DistrictRepository extends JpaRepository<District,Long> {

    Optional<District> findByCityAndName(CityEnum city , String name);

}
