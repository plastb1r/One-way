package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.PlaceRepository;
import com.example.saving_routes.repositories.RouteRepository;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class UserController {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRepository placeRepository;

    @GetMapping(path = "/opentest")
    public String test() {
        return "you in";
    }

    @GetMapping(path = "/user/{user_id}")
    public User getUser(@PathVariable(name = "user_id") String user_id) {
        return userRepository.findById(Integer.parseInt(user_id)).get();
    }

    @PutMapping(path = "/user/{user_id}")
    public User updateUser(@PathVariable(name = "user_id") String user_id, @RequestBody User user) {
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    @GetMapping(path = "/user/{user_id}/routes")
    public Iterable<Route> getRoutesByUserId(@PathVariable(name = "user_id") String userId) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        return routeRepository.findByOwner(user);
    }

    @PostMapping(path = "/user/{user_id}/routes/route")
    public Route addRoute(@PathVariable(name = "user_id") String userId, @RequestBody Route route) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        route.setOwner(user);
        // user.getRoutes().add(route); ???
        Route savedRoute = routeRepository.save(route);
        return savedRoute;
    }

    @DeleteMapping(path = "/user/{user_id}/routes/route")
    public String deleteRoute(@PathVariable(name = "user_id") String userId, @RequestBody Route route) {
        routeRepository.delete(route);
        // userRepository.findById(Integer.parseInt(userId)).get().getRoutes().remove(route);//?
        return routeRepository.existsById(route.getId()) ? "error" : "deleted";
    }

    @GetMapping(path = "/user/{user_id}/places")
    public Iterable<Place> getPlacesByUserId(@PathVariable(name = "user_id") String userId) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        return placeRepository.findAllByOwner(user);
    }

    @PostMapping(path = "/user/{user_id}/places/place")
    public Place addPlace(@PathVariable(name = "user_id") String userId, @RequestBody Place place) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        place.setOwner(user);
        Place savedPlace = placeRepository.save(place);
        // user.getPlaces().add(place); ???
        return savedPlace;
    }

    @DeleteMapping(path = "/user/{user_id}/places/place")
    public String deletePlace(@PathVariable(name = "user_id") String userId, @RequestBody Place place) {
        placeRepository.delete(place);
        // userRepository.findById(Integer.parseInt(userId)).get().getPlaces().remove(place);//?
        return placeRepository.existsById(Integer.parseInt(place.getId())) ? "error" : "deleted";
    }

    // callandparse
    // principal
}