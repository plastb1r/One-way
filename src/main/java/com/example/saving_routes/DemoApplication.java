package com.example.saving_routes;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class DemoApplication  extends SpringBootServletInitializer{
	public static Logger logger = LogManager.getLogger();
	static public void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		logger.info("App was started");
	}
}
