package com.example.saving_routes.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Point
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "points")
public class Point {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_id")
    private Integer id;

    @Column(name = "google_id")
    private String googleId;

    @JsonIgnore
    @OneToMany(mappedBy = "point")
    @Column(name = "point_routes")
    private Set<RoutePoint> routes;

    @Override
    public String toString() {
        return "{\"id\":" + id + ", \"googleId\":\"" + googleId + "\"}";
    }

}