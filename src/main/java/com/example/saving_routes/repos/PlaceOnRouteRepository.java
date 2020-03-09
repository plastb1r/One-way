package com.example.saving_routes.repos;

import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Route;

import org.springframework.data.repository.CrudRepository;

/**
 * PlaceRepository
 */
public interface PlaceOnRouteRepository extends CrudRepository<PlaceOnRoute, Integer> {
  Iterable<PlaceOnRoute> findAllByRoute(Route route);

}