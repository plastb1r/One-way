package com.example.saving_routes.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

import com.example.saving_routes.algorithm.Edge;
import com.example.saving_routes.algorithm.Graph;
import com.example.saving_routes.algorithm.JsonReader;
import com.example.saving_routes.algorithm.Node;
import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.Transports;
import com.example.saving_routes.repositories.RouteRepository;

import org.apache.log4j.Logger;
import org.json.simple.parser.ParseException;
import org.slf4j.LoggerFactory;
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

    public static Logger logger = Logger.getLogger(RouteGeneratorController.class);
    @Autowired
    RouteRepository routeRepository;

    @PostMapping(path = "/generate")
    public List<PlaceOnRoute> genereateRoutes(@RequestBody(required = false) List<Place> places)
            throws IOException, ParseException {
        String[] travelModes = { "driving", "walking", "transit", "bicycling" };
        String[] transitModes = { "BUS", "SUBWAY", "TRAIN", "TRAM", "RAIL" };
        ArrayList<String> placeId = new ArrayList<String>();
        String str = "";

        str += "place_id:" + places.get(0).getId();
        placeId.add(places.get(0).getId());
        for (int i = 1; i < places.size(); i++) {
            str += "|place_id:" + places.get(i).getId();
            placeId.add(places.get(i).getId());
        }

        HashMap<String, String> queryContent = new HashMap<>();
        String query = new String();
        for(String travelMode:travelModes)
        {
            query= "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ str +"&destinations=" + str +"&mode="+travelMode+"&key=AIzaSyCefImCcqdUPi-r6wfGymGrtSD9jzADZOI";
            final StringBuilder content = new StringBuilder();

            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(query).openConnection();
                final BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                queryContent.put(travelMode, content.toString());
                logger.info("Data from GoogleAPI was received");

            } catch (final Exception ex) {
                ex.printStackTrace();
                logger.error("Connection to GoogleAPI error",ex);
            }
        }

        Graph distances = new Graph();
        JsonReader reader = new JsonReader();
        ArrayList<Node> test = new ArrayList<Node>();

        test = reader.readNodesToArray(placeId);
        logger.info("Successfully read nodes from json file to array");
        for (Map.Entry<String, String> mode : queryContent.entrySet()) {
            reader.readEdgesArray(test, mode.getValue(), mode.getKey());
        }
        logger.info("Successfully read edges from json file to array");
        distances.setNodes(test);
        distances.simplifyGraph();
        ArrayList<Node> test1 = new ArrayList<Node>(test);
        Node start;
        start=distances.getNodes().get(0);
        Node end;
        end=distances.getNodes().get(test1.size()-1);
        test1.remove(test1.size()-1);
        test1.remove(0);
        LinkedList<Edge> resWay = new LinkedList<Edge>();
        int counter = 0;
        Long sum = Long.valueOf(0);
        Long sums[] = new Long[distances.factorial(test1.size())];
        sums = distances.shortWayPermute(start, end, test1, sum, test1.size());
        ArrayList<Node> minWay =  new ArrayList<Node>();
        minWay = distances.getMinWay();

        distances.filterMinWay();


        LinkedList<PlaceOnRoute> routes = new LinkedList<PlaceOnRoute>();
        int count = 0;
        for (Node p : minWay) {
            for (Place pl : places) {
                if (p.getId() == pl.getId()) {
                    count++;
                    if(!p.getEdges().isEmpty())
                    {
                        routes.add(new PlaceOnRoute(0,new Place(p.getId(), pl.getLat(), pl.getLng(), null),null,count,p.getEdges().get(0).getDuration(),Transports.valueOf(p.getEdges().get(0).getTravelMode())));
                    }
                    else
                    {
                        routes.add(new PlaceOnRoute(0,new Place(p.getId(), pl.getLat(), pl.getLng(), null),null,0,0L,null));
                    }
                }
            }
        }

        return routes;
    }

    @GetMapping(path = "/find")
    public Iterable<Route> findRoutes(@RequestParam(value = "city") String city) {
        return routeRepository.findByCity(city);
    }

}