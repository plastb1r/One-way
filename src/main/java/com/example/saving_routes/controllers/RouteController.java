package com.example.saving_routes.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.example.saving_routes.entity.Point;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.RoutePoint;
import com.example.saving_routes.repos.PointRepository;
import com.example.saving_routes.repos.RoutePointRepository;
import com.example.saving_routes.repos.RouteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/route")
public class RouteController {

    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private PointRepository pointRepository;
    @Autowired
    private RoutePointRepository routePointRepository;

    // @PostMapping(path = "/add")
    // public String addNewRoute(@RequestParam String name, @RequestParam Set<Point> points) {
    //     Route route = new Route();
    //     route.setName(name);
    //     route.setPoints(points);
    //     for (Point point : points) {
    //     point.setRoute(route);
    //     }
    //     routeRepository.save(route);
    //     return "Saved";
    // }

    @GetMapping(path = "/allroutes")
    public String getAllRoutes() {
        return "\"routes\":" + routeRepository.findAll().toString();
    }

    @GetMapping(path = "/allpoints")
    public String getAllPoints() {
        return "\"points\":" + pointRepository.findAll().toString();
    }

    @GetMapping(path = "/getbyid")
    public String getPointsFromRoute(@RequestParam() Integer routeid) {
        HashMap<Integer, String> points = new HashMap<Integer, String>();

        List<RoutePoint> rps = routePointRepository.findByRouteId(routeid);
        for (RoutePoint rp : rps) {
            Optional<Point> point = pointRepository.findById(rp.getId().getPointId());
            if (point.isPresent()) {
                points.put(rp.getIndex(), point.get().getGoogleId());
            }
        }
        return points.entrySet().toString();
    }

}