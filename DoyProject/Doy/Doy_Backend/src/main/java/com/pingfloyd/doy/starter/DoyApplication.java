package com.pingfloyd.doy.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.pingfloyd.doy")
@EnableJpaRepositories("com.pingfloyd.doy.repositories")
@EntityScan(basePackages = {"com.pingfloyd.doy.entities"}) // <-- Add this line

public class DoyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoyApplication.class, args);
	}

}
