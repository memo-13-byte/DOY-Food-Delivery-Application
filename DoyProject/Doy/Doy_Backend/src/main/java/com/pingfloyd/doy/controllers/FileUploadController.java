package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.entities.UserRoles;
import com.pingfloyd.doy.exception.StorageFileNotFoundException;
import com.pingfloyd.doy.exception.UnauthorizedRequestException;
import com.pingfloyd.doy.jwt.JwtService;
import com.pingfloyd.doy.services.ImageService;
import com.pingfloyd.doy.storage.IStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class FileUploadController {
    private final ImageService imageService;
    private final JwtService jwtService;

    @Autowired FileUploadController(ImageService imageService, JwtService jwtService) {
        this.imageService = imageService;
        this.jwtService = jwtService;
    }

    @PostMapping("/image/item/{id}")
    public ResponseEntity<?> uploadItemImage(@PathVariable(name = "id") Long id, @RequestParam("file") MultipartFile file) {
        if (!jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER))
            throw new UnauthorizedRequestException();
        return imageService.postItemImage(id, file);
    }

    @PostMapping("/image/restaurant/{id}")
    public ResponseEntity<?> uploadRestaurantImage(@PathVariable(name = "id") Long id, @RequestParam("file") MultipartFile file) {
        if (!jwtService.checkIfUserRole(UserRoles.RESTAURANT_OWNER))
            throw new UnauthorizedRequestException();
        return imageService.postRestaurantImage(id, file);
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<Resource> serveImage(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(imageService.getImage(id));
    }


    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
