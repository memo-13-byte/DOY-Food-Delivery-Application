package com.pingfloyd.doy.repositories;

import com.pingfloyd.doy.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {

}
