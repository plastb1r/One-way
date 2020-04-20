package com.example.saving_routes.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "places_on_route")
public class PlaceOnRoute {

    @JsonIgnore
    @Id
    @SequenceGenerator(name = "place_on_route_seq", sequenceName = "places_on_route_place_on_route_id_seq", allocationSize = 1, initialValue = 100)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "place_on_route_seq")
    @Column(name = "place_on_route_id")
    private Integer id;

    //@ManyToOne
    @Column(name = "place_id")
    private String place;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "place_index")
    private int index;

    @Column(name = "time_to_next_place") // hours
    private long timeToNext;

    @Column(name = "transport_to_next_place")
    private Transports transportToNext;

}