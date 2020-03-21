package com.example.saving_routes.entity;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.example.saving_routes.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.springframework.security.core.userdetails.UserDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({ "password", "routes", "places", "serialVersionUID", "accountNonExpired", "accountNonLocked",
        "credentialsNonExpired", "enabled", "username" })
@Entity
@Table(name = "users")
public class User implements UserDetails {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "user_name")
    private String name;

    @Column(name = "user_password")
    private String password;

    @Column(name = "user_email")
    private String email;

    @Column(name = "user_phone_number")
    private String phoneNumber;

    @OneToMany(mappedBy = "owner")
    @Column(name = "user_routes")
    private Set<Route> routes;

    @OneToMany(mappedBy = "owner")
    @Column(name = "user_places")
    private Set<Place> places;


    @OneToMany(fetch = FetchType.EAGER, mappedBy = "owner")
    @Column(name = "user_authorities")
    private List<Role> authorities;

    @Column(name = "user_expired")
    private boolean accountNonExpired;

    @Column(name = "user_non_locked")
    private boolean accountNonLocked;

    @Column(name = "user_credentials_non_expired")
    private boolean credentialsNonExpired;

    @Column(name = "user_enable")
    private boolean enabled;


    @Override
    public String getUsername() {
        return this.getName();
    }

}