package com.example.saving_routes.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "routes")
public class Route {
    @Id
    @SequenceGenerator(name = "route_seq", sequenceName = "routes_route_id_seq", allocationSize = 1, initialValue = 100)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "route_seq")
    @Column(name = "route_id")
    private Integer id;

    @Column(name = "route_name")
    private String name;

    @Column(name = "route_time_to_go") // hours
    private float timeToGo;

    @Column(name = "route_city")
    private String city;

    /*@ManyToOne
    @JoinColumn(name = "city_id")
    private City city;*/

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @OneToMany(mappedBy = "route")
    @Column(name = "route_places")
    private List<PlaceOnRoute> places;

}