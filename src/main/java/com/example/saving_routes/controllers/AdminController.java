package com.example.saving_routes.controllers;

import java.security.Principal;

import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.PlaceOnRouteRepository;
import com.example.saving_routes.repositories.RouteRepository;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/admin")
public class AdminController {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceOnRouteRepository placeOnRouteRepository;

    @GetMapping(path = "/users")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping(path = "/authuser")
    public Principal authUser(Principal principal) {
        return principal;
    }

    @GetMapping(path = "/routes")
    public Iterable<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @GetMapping(path = "/routes/{route_id}/places")
    public Iterable<PlaceOnRoute> getPlacesByRouteId(@PathVariable(name = "route_id") String routeId) {
        Route route = routeRepository.findById(Integer.parseInt(routeId)).get();
        return placeOnRouteRepository.findAllByRoute(route);
    }

}