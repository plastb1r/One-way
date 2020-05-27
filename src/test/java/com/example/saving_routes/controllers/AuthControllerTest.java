package com.example.saving_routes.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.saving_routes.algorithm.Edge;
import com.example.saving_routes.algorithm.Graph;
import com.example.saving_routes.algorithm.Node;
import com.example.saving_routes.entity.Parameters;
import com.example.saving_routes.entity.Place;
import com.example.saving_routes.entity.PlaceOnRoute;
import com.example.saving_routes.entity.Transports;
import com.example.saving_routes.repositories.PlaceRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
//import org.zalando.problem.ProblemModule;
//import org.zalando.problem.violations.ConstraintViolationProblemModule;
import com.example.saving_routes.entity.User;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.jupiter.api.Assertions.*;



public class AuthControllerTest {

    /*
    private List<Place> places;     

    User us = new User("Nastya", "nastya@gmail.com", "1111", "");

    @BeforeEach                           
    void setUp() {                               
       this.places = new ArrayList<>();                                    
       this.places.add(new Place());
       this.places.add(new Place());                        
       this.places.add(new Place());   
       
       //objectMapper.registerModule(new ProblemModule());
       //objectMapper.registerModule(new ConstraintViolationProblemModule());
    }

    @Test
    public void getListById() throws Exception {
        final Integer placeId = 1;

        final Place place = new Place();
        given(placeRep.findAllById("1")).willReturn(place);

        this.mockMvc.perform(get("/api/auth/places/{placeId}", placeId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(place.getId())))
                .andExpect(jsonPath("$.place_lat", is(place.getLat())));
    }

    @Test
    public void getLists() throws Exception {
        given(placeRep.findAllByOwner(us)).willReturn(places);
        this.mockMvc.perform(get("/api/auth/places"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(places.size())));
    }


    @Test
    void shouldUpdateList() throws Exception {
        String placeId = "1";
        Place place = new Place();
        given(placeRep.findAllById(placeId)).willReturn(place);
        given(placeRep.saveAndFlush(any(Place.class))).willAnswer((invocation) -> invocation.getArgument(0));

        this.mockMvc.perform(put("/api/auth/places")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(place)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(place.getId())))
                .andExpect(jsonPath("$.place_lat", is(place.getLat())))
                .andExpect(jsonPath("$.owner", is(place.getOwner())));
    }
*/
    @Test
    void getIndexOfMinTime() {
        List<Long> sums = new ArrayList<Long>();
        sums.add(7L);
        sums.add(3L);
        sums.add(2L);
        sums.add(10L);
        Graph graph = new Graph(); // Arrange
        int response = graph.getIndexOfMinTime(sums); // Act
        assertEquals(2, response);// Assert
    }

    @Test
    void getDuration(){
        ArrayList<Edge> edges = new ArrayList<Edge>();
        ArrayList<Edge> edges2 = new ArrayList<Edge>();
        ArrayList<Edge> edges3 = new ArrayList<Edge>();

        Node n1 = new Node("",0.0,false,false,new ArrayList<Edge>());
        Node n2 = new Node("",0.0,false,false,new ArrayList<Edge>());
        Node n3 = new Node("",0.0,false,false,new ArrayList<Edge>());

        edges.add(new Edge(n1, n2, 15L, ""));
        edges.add(new Edge(n1, n3, 14L, ""));
        edges2.add(new Edge(n2, n1, 13L, ""));
        edges2.add(new Edge(n2, n3, 12L, ""));
        edges3.add(new Edge(n3, n1, 11L, ""));
        edges3.add(new Edge(n3, n2, 10L, ""));

        n1.setEdges(edges);
        n2.setEdges(edges2);
        n3.setEdges(edges3);

        Graph graph = new Graph(); // Arrange
        Long response = graph.getDuration(n1, n3); // Act
        assertEquals(14L, response);// Assert
    }

    @Test
    void haveEdge(){
        ArrayList<Edge> edges = new ArrayList<Edge>();
        ArrayList<Edge> edges2 = new ArrayList<Edge>();
        ArrayList<Edge> edges3 = new ArrayList<Edge>();

        Node n1 = new Node("1",0.0,false,false,new ArrayList<Edge>());
        Node n2 = new Node("2",0.0,false,false,new ArrayList<Edge>());
        Node n3 = new Node("3",0.0,false,false,new ArrayList<Edge>());

        edges.add(new Edge(n1, n2, 15L, ""));
        //edges.add(new Edge(n1, n3, 14L, ""));
        edges2.add(new Edge(n2, n1, 13L, ""));
        edges2.add(new Edge(n2, n3, 12L, ""));
        //edges3.add(new Edge(n3, n1, 11L, ""));
        edges3.add(new Edge(n3, n2, 10L, ""));

        n1.setEdges(edges);
        n2.setEdges(edges2);
        n3.setEdges(edges3);

        Graph graph = new Graph(); // Arrange
        Boolean response = graph.haveEdge(n1, n3); // Act
        assertEquals(false, response);// Assert
    }

    @Test
    void permute() { 
        List<Integer> nums = new ArrayList<Integer>();
        nums.add(1);
        nums.add(2);
        nums.add(3);

        List<ArrayList<Integer>> res = new ArrayList<ArrayList<Integer>>();
        ArrayList<Integer> a = new ArrayList<Integer>();
        ArrayList<Integer> b = new ArrayList<Integer>();
        ArrayList<Integer> c = new ArrayList<Integer>();
        ArrayList<Integer> d = new ArrayList<Integer>();
        ArrayList<Integer> e = new ArrayList<Integer>();
        ArrayList<Integer> f = new ArrayList<Integer>();

        a.add(1);
        a.add(2);
        a.add(3);
        res.add(a);

        b.add(1);
        b.add(3);
        b.add(2);
        res.add(b);

        c.add(2);
        c.add(1);
        c.add(3);
        res.add(c);

        d.add(2);
        d.add(3);
        d.add(1);
        res.add(d);
     
        Graph graph = new Graph(); // Arrange
        ArrayList<ArrayList<Integer>> response = graph.permute(nums);
        assertArrayEquals(res.get(3).toArray(), response.get(3).toArray());
       // assertEquals(res, response);// Assert
    }

    @Test
    void shortWayPermute() {
        ArrayList<Edge> edges = new ArrayList<Edge>();
        ArrayList<Edge> edges2 = new ArrayList<Edge>();
        ArrayList<Edge> edges3 = new ArrayList<Edge>();
        ArrayList<Edge> edges4 = new ArrayList<Edge>();

        Node n1 = new Node("1",0.0,false,false,new ArrayList<Edge>());
        Node n2 = new Node("2",0.0,false,false,new ArrayList<Edge>());
        Node n3 = new Node("3",0.0,false,false,new ArrayList<Edge>());
        Node n4 = new Node("4",0.0,false,false,new ArrayList<Edge>());

        edges.add(new Edge(n1, n2, 15L, ""));
        edges.add(new Edge(n1, n3, 14L, ""));
        edges.add(new Edge(n1, n4, 11L, ""));

        edges2.add(new Edge(n2, n1, 13L, ""));
        edges2.add(new Edge(n2, n3, 12L, ""));
        edges2.add(new Edge(n2, n4, 12L, ""));

        edges3.add(new Edge(n3, n1, 11L, ""));
        edges3.add(new Edge(n3, n2, 10L, ""));
        edges3.add(new Edge(n3, n4, 10L, ""));


        edges4.add(new Edge(n4, n1, 11L, ""));
        edges4.add(new Edge(n4, n2, 10L, ""));
        edges4.add(new Edge(n4, n3, 10L, ""));

        n1.setEdges(edges);
        n2.setEdges(edges2);
        n3.setEdges(edges3);
        n4.setEdges(edges4);

        ArrayList<Node> nodes = new ArrayList<>();
        nodes.add(n2);
        nodes.add(n3);

        List<Long> res = new ArrayList<Long>();
        res.add(37L);
        res.add(36L);

        Graph graph = new Graph(); // Arrange
        List<Long> response = graph.shortWayPermute(
            n1, n4, nodes, 0L, 2
        );

        assertArrayEquals(res.toArray(), response.toArray());
    }

    @Test
    public void generateRoute() throws Exception {
        
        Place endPoint = new Place("ChIJn6vxlAMvO0ERbvEBSh8S2eg", "51.67388889999999", "39.21166659999999", null);
        Place startPoint = new Place("ChIJodrR9PQuO0ER8u3hopZhwUs", "51.6560376", "39.1890861", null);

        ArrayList<Place> locats = new ArrayList<>();
        locats.add(new Place("ChIJA7G_b_MuO0ERZbTv3_e15Ig", "51.65677609999999", "39.1852818", null));
        locats.add(new Place("ChIJT5iyMuUuO0ERZF768YDJYzk", "51.6659519", "39.1915035", null));

        String[] transportations = {"walking"};
        Parameters params = new Parameters(startPoint, endPoint, locats, transportations);

        PlaceOnRoute place = new PlaceOnRoute(0, "ChIJodrR9PQuO0ER8u3hopZhwUs",null, 1, 288L, Transports.walking);
        PlaceOnRoute place2 = new PlaceOnRoute(0, "ChIJA7G_b_MuO0ERZbTv3_e15Ig",null, 2, 897L, Transports.walking);
        PlaceOnRoute place3 = new PlaceOnRoute(0, "ChIJT5iyMuUuO0ERZF768YDJYzk",null, 3, 1565L, Transports.walking);
        PlaceOnRoute place4 = new PlaceOnRoute(0, "ChIJn6vxlAMvO0ERbvEBSh8S2eg",null, 4, 2750L, null);

        List<PlaceOnRoute> res = new ArrayList<>();
        res.add(place);
        res.add(place2);
        res.add(place3);
        res.add(place4);

        RouteGeneratorController contr = new RouteGeneratorController();
        List<PlaceOnRoute> response = contr.genereateRoutes(params);

        assertArrayEquals(res.toArray(), response.toArray());

       /* mvc.perform(get("/api/auth/generate", params))
            .andExpect(status().isOk());*/
    }

    @Test
    void simplifyGraph(){
        ArrayList<Edge> edges = new ArrayList<Edge>();
        ArrayList<Edge> edges2 = new ArrayList<Edge>();
        ArrayList<Edge> edges3 = new ArrayList<Edge>();


        Node n1 = new Node("1",0.0,false,false,new ArrayList<Edge>());
        Node n2 = new Node("2",0.0,false,false,new ArrayList<Edge>());
        Node n3 = new Node("3",0.0,false,false,new ArrayList<Edge>());


        edges.add(new Edge(n1, n2, 15L, "walk"));
        edges.add(new Edge(n1, n3, 9L, "walk"));
        edges.add(new Edge(n1, n2, 10L, "trans"));
        edges.add(new Edge(n1, n3, 14L, "trans"));

        edges2.add(new Edge(n2, n1, 13L, "trans"));
        edges2.add(new Edge(n2, n3, 12L, "trans"));
        edges2.add(new Edge(n2, n1, 10L, "walk"));
        edges2.add(new Edge(n2, n3, 10L, "walk"));

        edges3.add(new Edge(n3, n1, 11L, "trans"));
        edges3.add(new Edge(n3, n2, 10L, "trans"));
        edges3.add(new Edge(n3, n1, 14L, "walk"));
        edges3.add(new Edge(n3, n2, 15L, "walk"));

        n1.setEdges(edges);
        n2.setEdges(edges2);
        n3.setEdges(edges3);

        ArrayList<Node> nodes = new ArrayList<>();
        nodes.add(n1);
        nodes.add(n2);
        nodes.add(n3);

        ArrayList<Node> nodesMinWay = new ArrayList<>();
        nodesMinWay.add(n2);

        Graph graph = new Graph(); // Arrange
        graph.setNodes(nodes);
        graph.setMinWay(n1,nodesMinWay,n3 );
        graph.filterMinWay();

        ArrayList<Edge> edgesRes = new ArrayList<Edge>();
        ArrayList<Edge> edges2Res = new ArrayList<Edge>();
        ArrayList<Edge> edges3Res = new ArrayList<Edge>();


        Node n1Res = new Node("1",0.0,false,false,new ArrayList<Edge>());
        Node n2Res = new Node("2",0.0,false,false,new ArrayList<Edge>());
        Node n3Res = new Node("3",0.0,false,false,new ArrayList<Edge>());


        edgesRes.add(new Edge(n1Res, n3Res, 9L, "walk"));
        edgesRes.add(new Edge(n1Res, n2Res, 10L, "trans"));

        edges2Res.add(new Edge(n2Res, n1Res, 10L, "walk"));
        edges2Res.add(new Edge(n2Res, n3Res, 10L, "walk"));

        edges3Res.add(new Edge(n3Res, n1Res, 11L, "trans"));
        edges3Res.add(new Edge(n3Res, n2Res, 10L, "trans"));

        n1Res.setEdges(edgesRes);
        n2Res.setEdges(edges2Res);
        n3Res.setEdges(edges3Res);

        ArrayList<Node> nodesRes = new ArrayList<>();
        nodesRes.add(n1Res);
        nodesRes.add(n2Res);
        nodesRes.add(n3Res);

        assertArrayEquals(nodesRes.toArray(), graph.getNodes().toArray());
    }
}