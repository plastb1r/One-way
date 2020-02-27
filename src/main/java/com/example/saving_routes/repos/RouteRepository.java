package com.example.saving_routes.repos;

import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;

import org.springframework.data.repository.CrudRepository;

/**
 * RouteRepository
 */
public interface RouteRepository extends CrudRepository<Route, Integer> {
  Iterable<Route> findAllById(Integer id);
  Iterable<Route> findByOwner(User owner);
}