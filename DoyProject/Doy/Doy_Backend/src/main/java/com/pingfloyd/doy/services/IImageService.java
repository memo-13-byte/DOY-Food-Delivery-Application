package com.pingfloyd.doy.services;

import com.pingfloyd.doy.dto.DtoMenuItem;
import com.pingfloyd.doy.dto.DtoMenuItemIU;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    ResponseEntity<String> postRestaurantImage(Long id, MultipartFile file);
    ResponseEntity<String> postItemImage(Long id, MultipartFile file);
    Resource getImage(Long imageId);
}
