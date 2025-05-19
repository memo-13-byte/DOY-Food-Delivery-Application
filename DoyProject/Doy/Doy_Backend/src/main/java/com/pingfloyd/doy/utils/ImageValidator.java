package com.pingfloyd.doy.utils;

import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public class ImageValidator {
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/jpg"
    );

    public static boolean isValid(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }
        String contentType = file.getContentType();
        return ALLOWED_CONTENT_TYPES.contains(contentType);
    }
}
