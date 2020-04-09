package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin( origins = "*", maxAge = 3600)
@RequestMapping(path = "/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;

    @PostMapping(path = "/registration")
    public String registration(@RequestBody User user) {
        if (userRepository.findByName(user.getName()).isPresent()) {
            return "User has been registrated";
        }
        userRepository.save(user);
        return "Ok";
    }

    @GetMapping(path = "/login")
    public String login() {
        // return "login endpoint";
        return "ok";
        // return "redirect:/api/user/";
    }
}