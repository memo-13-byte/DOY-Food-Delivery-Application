package com.pingfloyd.doy.storage;

import com.pingfloyd.doy.entities.Image;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface IStorageService {
    void init();
    void store(MultipartFile file);
    void storeImage(MultipartFile file, Image image);
    Resource loadImage(Image image);
    void deleteImage(Image image);
    Stream<Path> loadAll();
    Path load(String filename);
    Resource loadAsResource(String filename);
    void deleteAll();
}
