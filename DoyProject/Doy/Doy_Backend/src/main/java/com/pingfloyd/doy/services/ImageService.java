package com.pingfloyd.doy.services;

import com.pingfloyd.doy.entities.Image;
import com.pingfloyd.doy.entities.MenuItem;
import com.pingfloyd.doy.entities.Restaurant;
import com.pingfloyd.doy.enums.ImageType;
import com.pingfloyd.doy.repositories.ImageRepository;
import com.pingfloyd.doy.repositories.ItemRepository;
import com.pingfloyd.doy.repositories.RestaurantRepository;
import com.pingfloyd.doy.storage.IStorageService;
import com.pingfloyd.doy.utils.ImageValidator;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageService implements IImageService {
    private final IStorageService storageService;
    private final ItemRepository itemRepository;
    private final RestaurantRepository restaurantRepository;
    private final ImageRepository imageRepository;
    @Autowired ImageService(IStorageService storageService,
                            ItemRepository itemRepository,
                            RestaurantRepository restaurantRepository,
                            ImageRepository imageRepository) {
        this.storageService = storageService;
        this.itemRepository = itemRepository;
        this.restaurantRepository = restaurantRepository;
        this.imageRepository = imageRepository;

    }
    @Override
    public ResponseEntity<String> postRestaurantImage(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No file uploaded or file is empty.");
        }
        if(!ImageValidator.isValid(file)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Only \".jpg\", \".jpeg\" and \".png\" file extensions allowed");
        }
        Restaurant restaurant;
        String ext = FilenameUtils.getExtension(file.getOriginalFilename());
        try {
            restaurant = restaurantRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Restaurant not found"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
        if(restaurant.getImage() == null) {
            Image image = new Image(ext.equals("jpeg") ? ImageType.JPEG : ext.equals("jpg") ? ImageType.JPG : ImageType.PNG);
            imageRepository.save(image);
            restaurant.setImage(image);
            restaurantRepository.save(restaurant);
        }
        storageService.storeImage(file, restaurant.getImage());
        return ResponseEntity.status(HttpStatus.CREATED).body("Image uploaded");
    }

    @Override
    public ResponseEntity<String> postItemImage(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No file uploaded or file is empty.");
        }
        if(!ImageValidator.isValid(file)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Only \".jpg\", \".jpeg\" and \".png\" file extensions allowed");
        }
        MenuItem menuItem;
        String ext = FilenameUtils.getExtension(file.getOriginalFilename());
        try {
            menuItem = itemRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("MenuItem not found"));
        } catch (EntityNotFoundException e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(e.getMessage());
        }
        if(menuItem.getImage() == null) {
            Image image = new Image(ext.equals("jpeg") ? ImageType.JPEG : ext.equals("jpg") ? ImageType.JPG : ImageType.PNG);
            imageRepository.save(image);
            menuItem.setImage(image);
            itemRepository.save(menuItem);
        }
        storageService.storeImage(file, menuItem.getImage());
        return ResponseEntity.status(HttpStatus.CREATED).body("Image uploaded");
    }

    @Override
    public Resource getImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new EntityNotFoundException("Image not found"));
        return storageService.loadImage(image);
    }
}
