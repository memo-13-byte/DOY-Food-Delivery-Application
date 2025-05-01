package com.pingfloyd.doy.controllers;

import com.pingfloyd.doy.exception.StorageFileNotFoundException;
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
    @Autowired FileUploadController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/image/item/{id}")
    public ResponseEntity<?> uploadItemImage(@PathVariable(name = "id") Long id, @RequestParam("file") MultipartFile file) {
        return imageService.postItemImage(id, file);
    }

    @PostMapping("/image/restaurant/{id}")
    public ResponseEntity<?> uploadRestaurantImage(@PathVariable(name = "id") Long id, @RequestParam("file") MultipartFile file) {
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
