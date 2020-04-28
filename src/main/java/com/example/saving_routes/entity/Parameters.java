package com.example.saving_routes.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import lombok.Data;

public class Parameters {
    private Place startPoint;
    private Place endPoint;
    private ArrayList<Place> locats;
    private String[] transportations;

    public Place getStartPoint() {
        return startPoint;
    }

    public void setStartPoint(Place place) {
        this.startPoint = place;
    }

    public Place getEndPoint() {
        return endPoint;
    }

    public void setEndPoint(Place place) {
        this.endPoint = place;
    }

    public  ArrayList<Place> getLocats() {
        return locats;
    }

    public void setLocats(ArrayList<Place> loc) {
        this.locats = loc;
    }

    public String[] getTransportations() {
        return transportations;
    }

    public void setTransportations(String[] transportations) {
        this.transportations = transportations;
    }

}