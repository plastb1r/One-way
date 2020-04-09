package com.example.saving_routes.entity;

import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

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
@JsonIgnoreProperties({ "routes", "places", "serialVersionUID", "username" })
@Entity
@Table(name = "users")
public class User implements UserDetails {

    private static final long serialVersionUID = 1L;

    @Id
    @SequenceGenerator(name = "user_seq", sequenceName = "users_user_id_seq", allocationSize = 1, initialValue = 100)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
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