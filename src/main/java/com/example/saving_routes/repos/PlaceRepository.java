package com.example.saving_routes.repos;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.User;

import org.springframework.data.repository.CrudRepository;

public interface PlaceRepository extends CrudRepository<Place, Integer> {
  Iterable<Place> findAllByOwner(User user);
}