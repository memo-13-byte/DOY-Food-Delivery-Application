package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Courier;
import com.pingfloyd.doy.entities.District;
import com.pingfloyd.doy.enums.CityEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface DistrictRepository extends JpaRepository<District,Long> {

    Optional<District> findByCityAndName(CityEnum city , String name);
    @Query("SELECT distinct d.city FROM District d ORDER BY d.city")
    List<String> findAllCities();
    @Query("SELECT d.name FROM District d where d.city = :city")
    List<String> findAllNames(@Param("city") CityEnum city);

}
