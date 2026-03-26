package com.example.minibankingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;


@SpringBootApplication (exclude = { DataSourceAutoConfiguration.class })
public class MinibankingsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(MinibankingsystemApplication.class, args);
	}

}
