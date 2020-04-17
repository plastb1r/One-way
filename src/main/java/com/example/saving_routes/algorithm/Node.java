package com.example.saving_routes.algorithm;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Objects;

public class Node {
    private Double lat;
    private Double lng;
    private String id;
    private  Double rating;
    private boolean isOpen;
    private boolean visited;
    //private LinkedList<Edge> edges;//hashmap
    private ArrayList<Edge> edges;

    public Node(){
        this("",0.0,false,false,new ArrayList<Edge>());
    }
    public Node(String id, Double rating, boolean isOpen, boolean visited, ArrayList<Edge> edges) {
        this.id = id;
        this.rating = rating;
        this.isOpen = isOpen;
        this.visited = visited;
        this.edges=edges;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
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

    /*public LinkedList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(LinkedList<Edge> edges) {
        this.edges = edges;
    }*/

    public ArrayList<Edge> getEdges() {
        return edges;
    }

    public void setEdges(ArrayList<Edge> edges) {
        this.edges = edges;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Node node = (Node) o;
        return Objects.equals(id, node.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
