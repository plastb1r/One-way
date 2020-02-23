package com.example.saving_routes.entity;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RoutePoint
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "route_points")
public class RoutePoint {

    @EmbeddedId
    RoutePointKey id;

    @JsonIgnore
    @ManyToOne
    @MapsId("route_id")
    @JoinColumn(name = "route_id")
    Route route;
    
    @JsonIgnore
    @ManyToOne
    @MapsId("point_id")
    @JoinColumn(name = "point_id")
    Point point;

    @Column(name = "point_index")
    int index;

}