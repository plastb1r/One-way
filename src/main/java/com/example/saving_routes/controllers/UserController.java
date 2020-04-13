package com.example.saving_routes.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.saving_routes.entity.*;
import com.example.saving_routes.payload.request.LoginRequest;
import com.example.saving_routes.payload.request.SignupRequest;
import com.example.saving_routes.payload.response.JwtResponse;
import com.example.saving_routes.payload.response.MessageResponse;
import com.example.saving_routes.repositories.CityRepository;
import com.example.saving_routes.repositories.PlaceOnRouteRepository;
import com.example.saving_routes.repositories.PlaceRepository;
import com.example.saving_routes.repositories.RoleRepository;
import com.example.saving_routes.repositories.RouteRepository;
import com.example.saving_routes.repositories.UserRepository;
import com.example.saving_routes.security.jwt.JwtUtils;
import com.example.saving_routes.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class UserController {
	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserRepository userRepository;

	@Autowired
    RoleRepository roleRepository;
    
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private PlaceRepository placeRepository;
    @Autowired
    private PlaceOnRouteRepository placeOnRouteRepository;
    @Autowired
    private CityRepository cityRepository;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtUtils jwtUtils;

	
	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);
		
		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();		
		List<String> roles = userDetails.getAuthorities().stream()
				.map(item -> item.getAuthority())
				.collect(Collectors.toList());

		return ResponseEntity.ok(new JwtResponse(jwt, 
												 userDetails.getId(), 
												 userDetails.getUsername(), 
												 userDetails.getEmail(), 
												 roles));
	}

	@PostMapping("/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity
					.badRequest()
					.body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), 
							 signUpRequest.getEmail(),
							 encoder.encode(signUpRequest.getPassword()), null);

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		if (strRoles == null) {
			Role userRole = roleRepository.findByName(ERole.ROLE_USER)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		} else {
			strRoles.forEach(role -> {
				switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(adminRole);
	
						break;
					case "mod":
						Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(modRole);
	
						break;
					default:
						Role userRole = roleRepository.findByName(ERole.ROLE_USER)
								.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
						roles.add(userRole);
					}
			});
		}

		user.setRoles(roles);
		userRepository.save(user);

		return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }	
    

    /*@GetMapping(path = "/{user_id}")
    public User getUser(@PathVariable(name = "user_id") String user_id) {
        return userRepository.findById(Integer.parseInt(user_id)).get();
    }

    @PutMapping(path = "/{user_id}")
    public User updateUser(@PathVariable(name = "user_id") String user_id, @RequestBody User user) {
        User savedUser = userRepository.saveAndFlush(user);
        return savedUser;
    }*/


    @GetMapping(path = "/{user_id}/routes")
    public Iterable<Route> getRoutesByUserId(@PathVariable(name = "user_id") String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        return routeRepository.findByOwner(user);
    }

    @PutMapping(path = "/{user_id}/routes")
    public Iterable<Route> saveRoute(@PathVariable(name = "user_id") String userId, @RequestBody Route route) {
        Route newRoute = new Route();
        newRoute.setTimeToGo(route.getTimeToGo());
        newRoute.setName(route.getName());

        City city = cityRepository.saveAndFlush(route.getCity());
        newRoute.setCity(city);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        newRoute.setOwner(user);

        routeRepository.saveAndFlush(newRoute);

        route.getPlaces().forEach(placeOnRoute -> {
            Place place = placeRepository.saveAndFlush(placeOnRoute.getPlace());
            placeOnRoute.setRoute(newRoute);
            placeOnRoute.setPlace(place);
            placeOnRouteRepository.saveAndFlush(placeOnRoute);
        });
        return routeRepository.findByOwner(user);
    }

    @DeleteMapping(path = "/{user_id}/routes/{route_id}")
    public String deleteRoute(@PathVariable(name = "route_id") Integer routeId) {
        routeRepository.deleteById(routeId);
        return routeRepository.existsById(routeId) ? "error" : "deleted";
    }

    @GetMapping(path = "/{user_id}/places")
    public Iterable<Place> getPlacesByUserId(@PathVariable(name = "user_id") String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        return placeRepository.findAllByOwner(user);
    }

    @PutMapping(path = "/{user_id}/places")
    public Place savePlace(@PathVariable(name = "user_id") String userId, @RequestBody Place place) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        place.setOwner(user);
        Place savedPlace = placeRepository.saveAndFlush(place);
        return savedPlace;
    }

    @DeleteMapping(path = "/{user_id}/places/{place_id}")
    public String deletePlace(@PathVariable(name = "user_id") String placeId) {
        placeRepository.deleteById(placeId);
        return placeRepository.existsById(placeId) ? "error" : "deleted";
    }
		
	/*@GetMapping(path = "/lists")
    public Iterable<ListToDo> getListsByUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        return listRepository.findAllByOwner(user);
	}
	
	@GetMapping(path = "/lists/{listId}")
    public ListToDo getListById(@PathVariable String listId) {
        return listRepository.findAllById(Integer.parseInt(listId));
    }

    @PutMapping(path = "/lists")
    public ListToDo saveList(@RequestBody ListToDo list) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        list.setOwner(user);
        ListToDo savedList = listRepository.saveAndFlush(list);
        return savedList;
    }

    @DeleteMapping(path = "/lists/{listId}")
    public String deleteList(@PathVariable String listId) {
        listRepository.deleteById(Integer.parseInt(listId));
        return listRepository.existsById(Integer.parseInt(listId)) ? "error" : "deleted";
    }

    @PutMapping(path = "/events")
    public Event saveEvent(@RequestBody Event event) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        event.setOwner(user);
        Event savedEvent = eventRepository.saveAndFlush(event);
        return savedEvent;
    }

    @DeleteMapping(path = "/events/{eventId}")
    public String deleteEvent(@PathVariable String eventId) {
        eventRepository.deleteById(Integer.parseInt(eventId));
        return eventRepository.existsById(Integer.parseInt(eventId)) ? "error" : "deleted";
	}
	
	@GetMapping(path = "/events/{eventId}")
    public Event getEventById(@PathVariable String eventId) {
		return eventRepository.findAllById(Integer.parseInt(eventId));
    }

    @GetMapping(path = "/events")
    public Iterable<Event> getEventsByUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        return eventRepository.findAllByOwner(user);
	}


	@PutMapping(path = "/lists/{listId}/things/")
    public Thing saveThing(@PathVariable String listId, @RequestBody Thing thing) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); 
		UserDetailsImpl us = (UserDetailsImpl)authentication.getPrincipal();
		User user = userRepository.findById(us.getId()).get();	
        thing.setOwner(user);
        Thing savedThing = thingRepository.saveAndFlush(thing);
        return savedThing;
	}
	

    @DeleteMapping(path = "/lists/{listId}/things/{thingId}")
    public String deleteThing(@PathVariable String thingId, @PathVariable String listId) {
        thingRepository.deleteById(Integer.parseInt(listId));
        return thingRepository.existsById(Integer.parseInt(thingId)) ? "error" : "deleted";
	}
	
	@GetMapping(path = "/lists/{listId}/things/{thingId}")
    public Thing getThingById(@PathVariable String thingId, @PathVariable String listId) {
		return thingRepository.findAllById(Integer.parseInt(thingId));
    }

    @GetMapping(path = "/lists/{listId}/things")
    public Iterable<Thing> getThingssByListId( @PathVariable String listId) {
		ListToDo list = listRepository.findById(Integer.parseInt(listId)).get();	
        return thingRepository.findAllByListId(list);
	}
    
    @DeleteMapping(path = "/{user_id}/lists/{list_id}/things/{thing_id}")
    public String deleteThing(@PathVariable(name = "user_id") String thingId) {
        thingRepository.deleteById(Integer.parseInt(thingId));
        return thingRepository.existsById(Integer.parseInt(thingId)) ? "error" : "deleted";
    }*/
}