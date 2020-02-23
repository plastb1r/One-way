package com.example.saving_routes.repos;

import java.util.List;

import com.example.saving_routes.entity.RoutePoint;

import org.springframework.data.repository.CrudRepository;

/**
 * RoutePointRepository
 */
public interface RoutePointRepository extends CrudRepository<RoutePoint, Integer> {
    List<RoutePoint> findByRouteId(Integer id);
}