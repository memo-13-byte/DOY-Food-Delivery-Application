package com.pingfloyd.doy.enums;

public enum ImageType {
    JPG("jpg"),
    JPEG("jpeg"),
    PNG("png");

    private final String extension;

    ImageType(String extension) {
        this.extension = extension;
    }

    public String getExtension() {
        return extension;
    }
}
