package com.example.saving_routes.entity;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Route
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer id;

    @Column(name = "route_name")
    private String name;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @JsonIgnore
    @OneToMany(mappedBy = "route")
    @Column(name = "route_places")
    private Set<Place> places;

    //time_to_travel + edges + time_for_edge + type_transport;

    //bind_to_city;

}