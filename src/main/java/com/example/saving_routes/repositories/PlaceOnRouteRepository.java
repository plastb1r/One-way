package com.example.saving_routes.repositories;

import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Route;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceOnRouteRepository extends JpaRepository<PlaceOnRoute, Integer> {
  Iterable<PlaceOnRoute> findAllByRoute(Route route);

}