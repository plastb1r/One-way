package com.example.saving_routes.controllers;

import java.util.ArrayList;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "api/routes")
class RouteGeneratorController {

  @GetMapping(path = "/generate")
  public Iterable<Route> genereateRoutes(Iterable<Place> places) {
    return new ArrayList<Route>();
  }

  @GetMapping(path = "/find")
  public Iterable<Route> findRoutes(Iterable<Place> places) {
    return new ArrayList<Route>();
  }

}