package com.example.saving_routes.algorithm;

import java.util.*;

import org.springframework.stereotype.Service;


@Service
public class Graph {
    private HashMap<String, Node> nodes;

    public Graph() {
        nodes = new HashMap<String, Node>();
    }

    public HashMap<String, Node> getNodes() {
        return nodes;
    }

    public void setNodes(HashMap<String, Node> nodes) {
        this.nodes = nodes;
    }

    public void addNode(Node newNode) {
        nodes.put(newNode.getId(), newNode);
    }

    public Node getNode(int index) {
        Node res = nodes.get(index);
        return res;
    }

    public Node setNode(int index) {
        Node res = nodes.get(index);
        return res;
    }

    public void allNotVisited(Node startPoint) {
        for (Map.Entry<String, Node> node : nodes.entrySet()) {
            if (!node.getValue().getId().equals(startPoint.getId())) {
                node.getValue().setVisited(false);
            }
        }
    }
//Near Neighbour
    public Long shortestWay(Node startPoint, Node endPoint, LinkedList<Node> resArray) {
        resArray.add(startPoint);
        if (startPoint.getEdges() == null) {
            return startPoint.getEdges().get(0).getDuration();
        }
        Long res = startPoint.getEdges().get(0).getDuration();
        int countPoint = nodes.size();
        int counter = 0;
        if (startPoint.getId().equals(endPoint.getId()) && counter == countPoint - 1) {
            return res;
        } else {
            for (Edge edge : startPoint.getEdges()) {
                if (!edge.getStartNode().isVisited()) {
                    startPoint.setVisited(true);
                    res += shortestWay(edge.getEndNode(), endPoint, resArray);
                    counter++;
                }
            }
        }
        return res;
    }
// CUSTOM ALG
    public List<Edge> shortGamiltoneWay(Node startPoint,
                                  Node endPoint,
                                  LinkedList<Edge> resArray,
                                  LinkedList<Edge> minResArray,
                                  int counter,
                                  Long curSum,
                                  Long minSum) {
        Edge minEdge;
        if (counter == nodes.size() - 1) {
            allNotVisited(startPoint);
            resArray.clear();
            return minResArray;
        }
        startPoint.setVisited(true);
        for (Edge edge : startPoint.getEdges()) {
            counter = resArray.size();
            if (edge.getEndNode().getId().equals(endPoint.getId()) && counter == nodes.size() - 2) {
                minEdge = edge;
                minEdge.getEndNode().setVisited(true);
                resArray.add(minEdge);
                curSum += minEdge.getDuration();
                if (curSum < minSum) {

                    shortGamiltoneWay(minEdge.getEndNode(), endPoint, resArray, resArray, counter, curSum += minEdge.getDuration(), curSum);
                }
            } else if (edge.getEndNode().isVisited() == false && !edge.getEndNode().getId().equals(endPoint.getId())) {
                minEdge = edge;
                minEdge.getEndNode().setVisited(true);
                resArray.add(minEdge);
                curSum += minEdge.getDuration();
                if (curSum > minSum) {
                    break;
                }
                shortGamiltoneWay(minEdge.getEndNode(), endPoint, resArray, minResArray, counter, curSum, minSum);
            }

        }

        return minResArray;
    }   
}
