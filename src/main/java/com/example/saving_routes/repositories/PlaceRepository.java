package com.example.saving_routes.repositories;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, Integer> {
  Iterable<Place> findAllByOwner(User user);
}