package com.example.saving_routes.repos;

import com.example.saving_routes.entity.Point;

import org.springframework.data.repository.CrudRepository;

/**
 * PointRepository
 */
public interface PointRepository extends CrudRepository<Point, Integer> {
}