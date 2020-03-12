package com.example.saving_routes.algorithm;

import java.util.ArrayList;
import java.util.LinkedList;

public class Node {
    private String id;
    private  Double rating;
    private boolean isOpen;
    private boolean visited;
    private LinkedList<Edge> edges;//hashmap

    public Node(){
        this("",0.0,false,false,new LinkedList<Edge>());
    }
    public Node(String id, Double rating, boolean isOpen, boolean visited, LinkedList<Edge> edges) {
        this.id = id;
        this.rating = rating;
        this.isOpen = isOpen;
        this.visited = visited;
        this.edges=edges;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public boolean isOpen() {
        return isOpen;
    }

    public void setOpen(boolean open) {
        isOpen = open;
    }

    public boolean isVisited() {
        return visited;
    }

    public void setVisited(boolean visited) {
        this.visited = visited;
    }

    public LinkedList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(LinkedList<Edge> edges) {
        this.edges = edges;
    }
}
