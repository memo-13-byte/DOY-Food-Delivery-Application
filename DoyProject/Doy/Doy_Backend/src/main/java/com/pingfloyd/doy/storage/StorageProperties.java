package com.pingfloyd.doy.storage;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

//fetches properties prefixed with storage
@ConfigurationProperties("storage")
@Getter
@Setter
public class StorageProperties {
    private String location = "upload-dir";
}
