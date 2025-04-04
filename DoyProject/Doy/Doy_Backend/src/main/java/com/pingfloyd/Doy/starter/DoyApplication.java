package com.pingfloyd.Doy.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude =  {DataSourceAutoConfiguration.class }) //no database connected yet
public class DoyApplication {

	public static void main(String[] args) {
		SpringApplication.run(DoyApplication.class, args);
	}

}
