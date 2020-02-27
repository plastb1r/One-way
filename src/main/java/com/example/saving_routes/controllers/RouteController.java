package com.example.saving_routes.controllers;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.User;
import com.example.saving_routes.repos.PlaceRepository;
import com.example.saving_routes.repos.RouteRepository;
import com.example.saving_routes.repos.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlaceRepository placeRepository;
    // @Autowired
    // private RoutePointRepository routePointRepository;

    @GetMapping(path = "/users")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping(path = "/users/{user_id}/routes")
    public Iterable<Route> getRoutesByUserId(@PathVariable(name = "user_id") String userId) {
        User user = userRepository.findById(Integer.parseInt(userId)).get();
        return routeRepository.findByOwner(user);
    }

    @GetMapping(path = "/routes")
    public Iterable<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @GetMapping(path = "/routes/{route_id}/places")
    public Iterable<Place> getPlacesByRouteId(@PathVariable(name = "route_id") String routeId) {
        Route route = routeRepository.findById(Integer.parseInt(routeId)).get();
        return placeRepository.findAllByRoute(route);
    }

    // callandparse

    // @PostMapping(path = "/add")
    // public String addNewRoute(@RequestParam String name, @RequestParam Set<Point>
    // points) {
    // Route route = new Route();
    // route.setName(name);
    // route.setPoints(points);
    // for (Point point : points) {
    // point.setRoute(route);
    // }
    // routeRepository.save(route);
    // return "Saved";
    // }

    // @GetMapping(path = "/getbyid")
    // public String getPointsFromRoute(@RequestParam() Integer routeid) {
    // HashMap<Integer, String> points = new HashMap<Integer, String>();

    // List<RoutePoint> rps = routePointRepository.findByRouteId(routeid);
    // for (RoutePoint rp : rps) {
    // Optional<Places> point = pointRepository.findById(rp.getId().getPointId());
    // if (point.isPresent()) {
    // points.put(rp.getIndex(), point.get().getGoogleId());
    // }
    // }
    // return points.entrySet().toString();
    // }

}