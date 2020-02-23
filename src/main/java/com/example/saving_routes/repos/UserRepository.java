package com.example.saving_routes.repos;

import com.example.saving_routes.entity.User;
import org.springframework.data.repository.CrudRepository;

/**
 * RouteRepository
 */
public interface UserRepository extends CrudRepository<User, Integer> {
    User findByName(String name);
}