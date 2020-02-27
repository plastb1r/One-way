package com.example.saving_routes.repos;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;

import org.springframework.data.repository.CrudRepository;

/**
 * PlaceRepository
 */
public interface PlaceRepository extends CrudRepository<Place, Integer> {
  Iterable<Place> findAllByRoute(Route route);
}