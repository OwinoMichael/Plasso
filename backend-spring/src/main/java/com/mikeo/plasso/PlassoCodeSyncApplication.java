package com.mikeo.plasso;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PlassoCodeSyncApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlassoCodeSyncApplication.class, args);
	}

}
