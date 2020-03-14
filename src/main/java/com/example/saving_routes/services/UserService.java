package com.example.saving_routes.services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.validation.constraints.NotNull;

import com.example.saving_routes.entity.SecurityUser;
import com.example.saving_routes.entity.User;
import com.example.saving_routes.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void init() {
        Iterable<User> users = userRepository.findAll();
        for (User user : users) {
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            userRepository.save(user);
        }
    }

    @Override
    public UserDetails loadUserByUsername(@NotNull String username) throws UsernameNotFoundException {
        SecurityUser user = new SecurityUser(userRepository.findByName(username));
        if (user.equals(null)) {
            throw new UsernameNotFoundException("user " + username + " was not found!");
        } else {
            return user;
        }
    }
    
}
