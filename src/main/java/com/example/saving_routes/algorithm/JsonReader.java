package com.example.saving_routes.algorithm;

import org.json.JSONException;
import org.json.JSONTokener;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

public class JsonReader {

    public HashMap<String, Node> readNodes(String path) throws IOException, ParseException {
        HashMap<String, Node> res = new HashMap<String, Node>();
        JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader(path);
        Object obj = jsonParser.parse(reader);
        JSONObject jsonObject = (JSONObject) obj;
        JSONArray origins = (JSONArray) jsonObject.get("origin_addresses");
        for (Object o : origins) {
            Node newNode = new Node();
            newNode.setId((String) o);
            res.put((String) o, newNode);
        }
        return res;
    }

    public void readEdges(HashMap<String, Node> nodes, String path, String travelMode)
            throws IOException, ParseException {
        JSONParser jsonParser = new JSONParser();
        FileReader reader = new FileReader(path);
        Object obj = jsonParser.parse(reader);
        JSONObject jsonObject = (JSONObject) obj;
        JSONArray origins = (JSONArray) jsonObject.get("origin_addresses");
        JSONArray destinations = (JSONArray) jsonObject.get("destination_addresses");
        JSONArray rows = (JSONArray) jsonObject.get("rows");
        int counter1 = 0;
        for (Object o : origins) {
            Node startNode = nodes.get(o);
            int counter2 = 0;
            for (Object d : destinations) {
                Node endNode = nodes.get(d);
                if (!d.equals(o)) {
                    JSONObject array = (JSONObject) rows.get(counter1);
                    JSONArray elements = (JSONArray) array.get("elements");
                    JSONObject element = (JSONObject) elements.get(counter2);
                    JSONObject duration = (JSONObject) element.get("duration");
                    Object val = duration.get("value");
                    Edge edge = new Edge();
                    edge.setStartNode(startNode);
                    edge.setEndNode(endNode);
                    edge.setDuration((Long) val);
                    edge.setTravelMode(travelMode);
                    startNode.getEdges().add(edge);
                }
                counter2++;
            }
            counter1++;
        }
    }
}
