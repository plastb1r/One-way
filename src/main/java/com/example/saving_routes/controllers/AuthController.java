package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin( origins = "*", maxAge = 3600)
@RequestMapping(path = "/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping(path = "/registration")
    public String registration(User user) {
        return "registration endpoint";
    }

}