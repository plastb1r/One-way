
package com.example.saving_routes.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
  @Column(name = "place_on_route_id")
  @GeneratedValue(strategy = GenerationType.AUTO)
  private String id;

  @ManyToOne
  @JoinColumn(name = "place_id")
  private Place place;

  @JsonIgnore
  @ManyToOne
  @JoinColumn(name = "route_id")
  private Route route;

  @Column(name = "place_index")
  private int index;

  @Column(name = "time_to_next_place") // hours
  private float timeToNext;

  @Column(name = "transport_to_next_place")
  private Transports transportToNext; 

}