package com.example.saving_routes.algorithm;

import jdk.nashorn.api.scripting.JSObject;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;

public class Main {
    public static void main(String[] args) throws IOException, ParseException {
        Graph distances=new Graph();
        JsonReader reader = new JsonReader();
        /*
        distances=reader.read("C:\\Users\\павел\\Desktop\\DistanceAlg\\src\\main\\resources\\example.json","DRIVING");
        distances=reader.addTravelMode(distances,"WALKING","C:\\Users\\павел\\Desktop\\DistanceAlg\\src\\main\\resources\\example2.json");
       */
        /*
        distances=reader.read("C:\\Users\\павел\\Desktop\\DistanceAlg\\src\\main\\resources\\testDriving.json","DRIVING");
        distances=reader.addTravelMode(distances,"WALKING","C:\\Users\\павел\\Desktop\\DistanceAlg\\src\\main\\resources\\testTransit.json");

        Node start = new Node();
        start=distances.searchNode("Гринвич, Великобритания");
        Node end = new Node();
        end=distances.searchNode("Dlouhá 609/2, 110 00 Praha-Staré Město, Чехия");
        ArrayList<Node> ex = new ArrayList<Node>();
        Long res=distances.shortestWay(start,end,ex);
        distances.createTreeFromNodes(start);
         */
        //HashMap<String,Node> rs = new HashMap<String, Node>();
        //rs = reader.readNodes("src/main/resources/test jsons/voronezhDdriving.json");
        //reader.readEdges(rs,"src/main/resources/test jsons/voronezhDdriving.json","DRIVING");
        //reader.readEdges(rs,"src/main/resources/test jsons/voronezhTransit.json","TRANSIT");
        //reader.readEdges(rs,"src/main/resources/test jsons/voronezhWalking.json","WALKING");
        //distances.setNodes(rs);
        ArrayList<Node> test = new ArrayList<Node>();
        //test = reader.readNodesToArray("src/main/resources/test jsons/voronezhDdriving.json");
        //reader.readEdgesArray(test,"src/main/resources/test jsons/voronezhDdriving.json","DRIVING");
        test = reader.readNodesToArray("src/main/resources/test jsons/example2.json");
        reader.readEdgesArray(test,"src/main/resources/test jsons/example2.json","DRIVING");
        //reader.readEdgesArray(test,"src/main/resources/test jsons/voronezhTransit.json","TRANSIT");
        //reader.readEdgesArray(test,"src/main/resources/test jsons/voronezhWalking.json","WALKING");
        distances.setNodes(test);
        ArrayList<Node> test1 = new ArrayList<Node>(test);
        test1.remove(4);
        test1.remove(0);
        Node start;
        start=distances.getNodes().get(0);
        Node end;
        end=distances.getNodes().get(4);
        LinkedList<Edge> resWay = new LinkedList<Edge>();
       // LinkedList<Edge> minResWay=new LinkedList<Edge>();
      //  Long a = distances.shortestWay(start,end,resWay);
        int counter=0;
        Long sum = Long.valueOf(0);
        Long sums[] = new Long[6];
        sums = distances.shortWayPermute(start, end, test1, sum, 3);
        JsonWriter writer = new JsonWriter();
        JSONObject obj = writer.writeResultWay(test1);
       //Long minSum=Long.valueOf(999999999);
       //ArrayList<ArrayList<Long>> test = distances.getPermutations(3);

       // distances.shortGamiltoneWay(start,end, resWay, minResWay, counter,sum,minSum);
        //distances.shortestWay(start,end,resWay,counter,sum);
        System.out.println("A");
    }
}
