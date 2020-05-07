package com.example.saving_routes.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.function.ToLongFunction;

import com.example.saving_routes.algorithm.Edge;
import com.example.saving_routes.algorithm.Graph;
import com.example.saving_routes.algorithm.JsonReader;
import com.example.saving_routes.algorithm.Node;
import com.example.saving_routes.entity.Parameters;
import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Route;
import com.example.saving_routes.entity.Transports;
import com.example.saving_routes.repositories.RouteRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.parser.ParseException;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "api/auth")
class RouteGeneratorController {

    public static Logger logger = LogManager.getLogger();

    RouteRepository routeRepository;

    @PostMapping(path = "/generate")
    public List<PlaceOnRoute> genereateRoutes(@RequestBody Parameters params)
            throws IOException, ParseException {
        //String[] travelModes = {  "walking", "transit", "bicycling" };
        String[] travelModes = params.getTransportations();
        String[] transitModes = { "BUS", "SUBWAY", "TRAIN", "TRAM", "RAIL" };
        ArrayList<String> placeId = new ArrayList<String>();
        String str = "";

        /*str += "place_id:" + params.getLocats().get(0).getId();
        placeId.add(params.getLocats().get(0).getId());
        for (int i = 1; i < params.getLocats().size(); i++) {
            str += "|place_id:" + params.getLocats().get(i).getId();
            placeId.add(params.getLocats().get(i).getId());
        }*/

        str += "place_id:" + params.getStartPoint().getId();
        placeId.add(params.getStartPoint().getId());
        for (int i = 0; i < params.getLocats().size(); i++) {
            str += "|place_id:" + params.getLocats().get(i).getId();
            placeId.add(params.getLocats().get(i).getId());
        }
        str += "|place_id:" + params.getEndPoint().getId();
        placeId.add(params.getEndPoint().getId());
    

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
                try {
                    for (String line = null; (line = in.readLine()) != null;) {
                        content.append(line);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }

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
        //test = reader.readNodesToArray(params.getLocats());
        logger.info("Successfully read nodes from json file to array");
        for (Map.Entry<String, String> mode : queryContent.entrySet()) {
            reader.readEdgesArray(test, mode.getValue(), mode.getKey());
        }
        logger.info("Successfully read edges from json file to array");
        distances.setNodes(test);
        try{
            distances.simplifyGraph();
            logger.info("Graph was simplified");
        }
        catch (final Exception e)
        {
            logger.error("Simplify error", e);
        }

        ArrayList<Node> test1 = new ArrayList<Node>(test);
        Node start;
        start=distances.getNodes().get(0);
        logger.debug("Start node {}",start.getId());
        Node end;
        end=distances.getNodes().get(test1.size()-1);
        logger.debug("End node {}",end.getId());
        test1.remove(test1.size()-1);
        test1.remove(0);
        LinkedList<Edge> resWay = new LinkedList<Edge>();
        int counter = 0;
        Long sum = Long.valueOf(0);
        Long sums[] = new Long[distances.factorial(test1.size())];
        sums = distances.shortWayPermute(start, end, test1, sum, test1.size());
        logger.debug("Graph was permuted");
        ArrayList<Node> minWay =  new ArrayList<Node>();
        minWay = distances.getMinWay();

        try{
            distances.filterMinWay();
            logger.info("Graph was filtered");
        }
        catch (final Exception e)
        {
            logger.error("Graph filter error", e);
        }
        LinkedList<PlaceOnRoute> routes = new LinkedList<PlaceOnRoute>();
        int count = 0;
        for (Node p : minWay) {
           // for (Place pl : places) {
               // if (p.getId() == pl.getId()) {
                    count++;
                    if(!p.getEdges().isEmpty())
                    {
                        routes.add(new PlaceOnRoute(0,p.getId(),null,count,p.getEdges().get(0).getDuration(),Transports.valueOf(p.getEdges().get(0).getTravelMode())));
                    }
                    else
                    {
                        routes.add(new PlaceOnRoute(0,p.getId(),null,count,countTime(routes),null));
                    }
               // }
            //}
        }

        return routes;
    }

    public Long countTime(LinkedList<PlaceOnRoute> routes){
        Long time = Long.valueOf(0);;
        for (PlaceOnRoute p : routes) {
            time += p.getTimeToNext();
        }
        return time;
    }

    @GetMapping(path = "/find")
    public Iterable<Route> findRoutes(@RequestParam(value = "city") String city) {
        return routeRepository.findByCity(city);
    }

}