package com.example.saving_routes.repositories;

import java.util.Optional;

import com.example.saving_routes.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByName(String name);
}