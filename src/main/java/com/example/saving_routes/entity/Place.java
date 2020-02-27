package com.example.saving_routes.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Places
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "places")
public class Place {

    @Id
    @Column(name = "place_id")
    private String id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "place_index")
    private int index;

    @Override
    public String toString() {
        return "{\"id\":" + this.id + ", \"googleId\":\"" + this.index + "\"}";
    }

    //coordinates_of_places
}