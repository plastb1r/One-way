package com.example.saving_routes.repositories;

import com.example.saving_routes.entity.City;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Integer> {

}