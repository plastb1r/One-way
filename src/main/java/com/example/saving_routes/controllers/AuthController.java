package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.User;
import com.example.saving_routes.repos.PlaceOnRouteRepository;
import com.example.saving_routes.repos.PlaceRepository;
import com.example.saving_routes.repos.RouteRepository;
import com.example.saving_routes.repos.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
   
    @PostMapping(path = "/login")  
    public void login(String token) {
        // принемаем токен, генерим пользователя в сессии
    }
}