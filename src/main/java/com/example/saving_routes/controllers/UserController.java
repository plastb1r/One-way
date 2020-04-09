package com.example.saving_routes.controllers;

import java.security.Principal;

import com.example.saving_routes.entity.City;
import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.CityRepository;
import com.example.saving_routes.repositories.PlaceOnRouteRepository;
import com.example.saving_routes.repositories.PlaceRepository;
import com.example.saving_routes.repositories.RouteRepository;
import com.example.saving_routes.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "/api/user")
public class UserController {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private PlaceOnRouteRepository placeOnRouteRepository;
    @Autowired
    private CityRepository cityRepository;


    @GetMapping(path = "/")
    public User getUser(Principal principal) {
        System.out.println("Name: \"" + principal.getName() + "\"");
        userRepository.findByName(principal.getName()).get();

        return userRepository.findByName(principal.getName()).get();
    }

    @PutMapping(path = "/")
    public User updateUser(Principal principal, @RequestBody User user) {
        User savedUser = userRepository.saveAndFlush(user);
        return savedUser;
    }

    /*@GetMapping(path = "/{user_id}")
    public User getUser(@PathVariable(name = "user_id") String user_id) {
        return userRepository.findById(Integer.parseInt(user_id)).get();
    }

    @PutMapping(path = "/{user_id}")
    public User updateUser(@PathVariable(name = "user_id") String user_id, @RequestBody User user) {
        User savedUser = userRepository.saveAndFlush(user);
        return savedUser;
    }*/

    @GetMapping(path = "/{user_id}/routes")
    public Iterable<Route> getRoutesByUserId(@PathVariable(name = "user_id") String userId) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        return routeRepository.findByOwner(user);
    }

    @PutMapping(path = "/{user_id}/routes")
    public Iterable<Route> saveRoute(@PathVariable(name = "user_id") String userId, @RequestBody Route route) {
        Route newRoute = new Route();
        newRoute.setTimeToGo(route.getTimeToGo());
        newRoute.setName(route.getName());

        City city = cityRepository.saveAndFlush(route.getCity());
        newRoute.setCity(city);

        User user = userRepository.findById(Integer.parseInt(userId)).get();
        newRoute.setOwner(user);

        routeRepository.saveAndFlush(newRoute);

        route.getPlaces().forEach(placeOnRoute -> {
            Place place = placeRepository.saveAndFlush(placeOnRoute.getPlace());
            placeOnRoute.setRoute(newRoute);
            placeOnRoute.setPlace(place);
            placeOnRouteRepository.saveAndFlush(placeOnRoute);
        });
        return routeRepository.findByOwner(user);
    }

    @DeleteMapping(path = "/{user_id}/routes/{route_id}")
    public String deleteRoute(@PathVariable(name = "route_id") Integer routeId) {
        routeRepository.deleteById(routeId);
        return routeRepository.existsById(routeId) ? "error" : "deleted";
    }

    @GetMapping(path = "/{user_id}/places")
    public Iterable<Place> getPlacesByUserId(@PathVariable(name = "user_id") String userId) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        return placeRepository.findAllByOwner(user);
    }

    @PutMapping(path = "/{user_id}/places")
    public Place savePlace(@PathVariable(name = "user_id") String userId, @RequestBody Place place) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        place.setOwner(user);
        Place savedPlace = placeRepository.saveAndFlush(place);
        return savedPlace;
    }

    @DeleteMapping(path = "/{user_id}/places/{place_id}")
    public String deletePlace(@PathVariable(name = "user_id") String placeId) {
        placeRepository.deleteById(placeId);
        return placeRepository.existsById(placeId) ? "error" : "deleted";
    }

    // @PreAuthorize
    // Callandparse
    // Principal
    // AuthenticationPrincipal
    // SecurityContextHolder.getContext().getAuthentication().getPrincipal()
    // responseEntity
    // saveAndFlush
}