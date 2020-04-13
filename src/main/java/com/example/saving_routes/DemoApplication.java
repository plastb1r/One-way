package com.example.saving_routes;

import org.apache.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.saving_routes")
public class DemoApplication {
	public static Logger logger = Logger.getLogger(DemoApplication.class);
	static public void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		logger.info("App was started");
	}
}
