package com.example.saving_routes.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cities")
public class City {

  @JsonIgnore
  @Id
  @SequenceGenerator(name = "city_seq", sequenceName = "cities_city_id_seq", allocationSize = 1, initialValue = 100)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "city_seq")
  @Column(name = "city_id")
  private Integer id;

  @Column(name = "city_name")
  private String name;

}