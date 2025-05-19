package com.pingfloyd.doy.starter;

import com.pingfloyd.doy.storage.StorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.pingfloyd.doy"})
@EntityScan(basePackages = {"com.pingfloyd.doy"})
@EnableJpaRepositories(basePackages = {"com.pingfloyd.doy"})
@EnableConfigurationProperties(StorageProperties.class)
public class DoyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoyApplication.class, args);
	}

}
