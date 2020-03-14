package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
   
    @PutMapping(path = "/login")
    public String login(String token) {
        return "login endpoint";
    }

    @PostMapping(path = "/registration")
    public String registration(String token) {
        return "registration endpoint";
    }

}