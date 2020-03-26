package com.example.saving_routes.controllers;

import static org.junit.Assert.fail;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.repositories.RouteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "api/routes")
class RouteGeneratorController {

    @Autowired
    RouteRepository routeRepository;

    @PostMapping(path = "/generate")
    public Iterable<Route> genereateRoutes(@RequestBody(required = false) Iterable<Place> places) {
        String query = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=Vancouver+BC|Seattle&destinations=San+Francisco|Victoria+BC&mode=bicycling&language=fr-FR&key=AIzaSyCefImCcqdUPi-r6wfGymGrtSD9jzADZOI";
        final StringBuilder content = new StringBuilder();

        try {
            
            HttpURLConnection connection = (HttpURLConnection) new URL(query).openConnection();
            final BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }

        } catch (final Exception ex) {
            ex.printStackTrace();
        }

        System.out.println("\n\n" + content.toString() + "\n\n");

        return new ArrayList<Route>();
    }

    @GetMapping(path = "/find")
    public Iterable<Route> findRoutes(@RequestParam(value = "city") String city) {
        return routeRepository.findByCity(city);
    }

}