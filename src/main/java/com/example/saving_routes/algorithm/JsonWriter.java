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
        for(int i =0; i<nodes.size()-1;i++)
        {
            arrayNodes.add(nodes.get(i).getId());
            if(nodes.get(i).getEdges().size()!=0)
            {
                arrayEdges.add(nodes.get(i).getEdges().get(0).getDuration());
            }

        }
        res.put("nodes",arrayNodes);
        res.put("edges",arrayEdges);

        return res;
    }
}
