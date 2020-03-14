package com.example.saving_routes.repositories;

import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Integer> {
  Iterable<Route> findAllById(Integer id);
  Iterable<Route> findByOwner(User owner);
  
}