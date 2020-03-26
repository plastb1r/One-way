package com.example.saving_routes.algorithm;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class JsonWriter {
    public JSONObject writeResultWay(ArrayList<Node> nodes)
    {
        JSONObject res = new JSONObject();
        JSONArray arrayNodes = new JSONArray();
        JSONArray arrayEdges = new JSONArray();
        for(Node node: nodes)
        {
            arrayNodes.add(node.getId());
            if(node.getEdges().size()!=0)
            {
                arrayEdges.add(node.getEdges());
            }

        }
        res.put("nodes",arrayNodes);
        res.put("edges",arrayEdges);

        return res;
    }
}
