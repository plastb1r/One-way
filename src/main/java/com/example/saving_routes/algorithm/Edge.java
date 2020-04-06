package com.example.saving_routes.algorithm;

import java.math.BigDecimal;

public class Edge {
    private Node startNode;
    private Node endNode;
    private Long duration;
    private String travelMode;
    private BigDecimal cost;

    public Edge() {
        startNode = new Node();
        endNode = new Node();
        duration = Long.valueOf(0);
        travelMode = "driving";
        cost = BigDecimal.valueOf(0.0);
    }

    public Edge(Node startNode, Node endNode, Long duration, String travelMode, BigDecimal cost) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.duration = duration;
        this.travelMode = travelMode;
        this.cost = cost;
    }

    public Node getStartNode() {
        return startNode;
    }

    public void setStartNode(Node startNode) {
        this.startNode = startNode;
    }

    public Node getEndNode() {
        return endNode;
    }

    public void setEndNode(Node endNode) {
        this.endNode = endNode;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }

    public String getTravelMode() {
        return travelMode;
    }

    public void setTravelMode(String travelMode) {
        this.travelMode = travelMode;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }
}
