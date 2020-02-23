package com.example.saving_routes.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


/**
 * MainController
 */
@Controller
public class MainController {

    @GetMapping("/home")
    public String home() {
        return "home";
    }
    
    
}