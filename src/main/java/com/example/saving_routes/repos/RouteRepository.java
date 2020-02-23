package com.example.saving_routes.repos;

import com.example.saving_routes.entity.Route;
import org.springframework.data.repository.CrudRepository;

/**
 * RouteRepository
 */
public interface RouteRepository extends CrudRepository<Route, Integer> {
    
}