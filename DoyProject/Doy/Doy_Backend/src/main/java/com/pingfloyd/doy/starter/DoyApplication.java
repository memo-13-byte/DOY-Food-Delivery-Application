package com.pingfloyd.doy.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication() //no database connected yet
@ComponentScan(basePackages = {"com.pingfloyd.doy"})
@EntityScan(basePackages = {"com.pingfloyd.doy"})
@EnableJpaRepositories(basePackages = {"com.pingfloyd.doy"})
public class DoyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoyApplication.class, args);
	}

}
