package com.example.saving_routes.algorithm;

import java.util.*;
import org.springframework.stereotype.Service;


//@Service
public class Graph {

    private ArrayList<Node> nodes;
    private ArrayList<Node> minWay = new ArrayList<>();

    public void setMinWay(Node startPoint, ArrayList<Node> nodes, Node endPoint){
        minWay.add(startPoint);
        minWay.addAll(nodes);
        minWay.add(endPoint);
    }

    public void filterMinWay(){
        for(int i=0; i<minWay.size()-1; i++)
        {
            int j=0;
            while (minWay.get(i).getEdges().get(j).getEndNode()!=minWay.get(i+1))
            {
                j++;
                if (j == minWay.size()-1){
                    j--;
                    break;
                }
            }
            Edge rEdge=minWay.get(i).getEdges().get(j);
            minWay.get(i).getEdges().clear();
            minWay.get(i).getEdges().add(rEdge);
        }
        minWay.get(minWay.size()-1).getEdges().clear();
    }

    public ArrayList<Node> getMinWay() {
        return minWay;
    }

    public Graph() {
        nodes = new ArrayList<Node>();
    }

    public ArrayList<Node> getNodes() {
        return nodes;
    }

    public void setNodes(ArrayList<Node> nodes) {
        this.nodes = nodes;
    }

    public void addNode(Node newNode) {
        nodes.add(newNode);
    }

    public Node getNode(int index) {
        Node res = nodes.get(index);
        return res;
    }

    public Node setNode(int index) {
        Node res = nodes.get(index);
        return res;
    }

    public int factorial(int number)
    {
        int res=1;
        for(int i = 1; i<=number; i++)
        {
            res*=i;
        }
        return  res;
    }


    // function uses permutations to combine all nodes between start and end;
    // then shouls check edges(-) and count durations - sum;
    // returns time for each permutation ;
    public List<Long> shortWayPermute(Node startPoint,
                                Node endPoint,
                                ArrayList<Node> nodeArray,
                                Long curSum,
                                int resSize
                                ){
                                    
        int counter = resSize;
        //Integer[] firstpermutation = new Integer[counter];
        List<Integer> firstpermutation = new ArrayList<>();
        for(int i = 0; i< counter; i++){
            firstpermutation.add(i);
        }
        List<ArrayList<Integer>> permutations = new ArrayList<ArrayList<Integer>>();

        permutations.addAll(permute(firstpermutation));
        int permuteArraySize = permutations.size();
        List<Long> sums = new ArrayList<Long>();

        for (int i = 0; i < permutations.size() ; i++) { 
            for (int j = 0; j < permutations.get(i).size() - 1; j++) { 
                if(j == 0) {
                    Node c = nodeArray.get(permutations.get(i).get(j));
                    curSum += getDuration(startPoint, nodeArray.get(permutations.get(i).get(j)));
                }
                curSum += getDuration(nodeArray.get(permutations.get(i).get(j)),  nodeArray.get(permutations.get(i).get(j+1)));
                if(j + 1 == permutations.get(i).size() - 1)
                { 
                    curSum += getDuration(nodeArray.get(permutations.get(i).get(j)), endPoint);
                }
            } 
            sums.add(i, curSum);;
            curSum =  Long.valueOf(0);
        } 
        ArrayList<Node> permuteNodes = new ArrayList<Node>();
        int index = getIndexOfMinTime(sums);
        for (int i = 0; i < nodeArray.size(); i++){
            permuteNodes.add( nodeArray.get(permutations.get(index).get(i))); 
        }
        setMinWay(startPoint, permuteNodes, endPoint);
        return sums;

    }

    public int getIndexOfMinTime(List<Long> sums){
        int indexOfMin = 0;
        for (int i = 1; i < sums.size(); i++)
        {
            if (sums.get(i) < sums.get(indexOfMin))
            {
                indexOfMin = i;
            }
        }
        return indexOfMin;
    }

    public Long getDuration(Node n1, Node n2){ // function returns durations between 2 nodes
        Long res = null;
        for (Edge edge : n1.getEdges()) {
            if(edge.getEndNode().equals(n2)){
               res = edge.getDuration();
            }
        }
        return res;
    }

    public boolean haveEdge(Node n1, Node n2){ // function checks if there is an edge between two nodes
        boolean res = false;
        for (Edge edge : n1.getEdges()) {
            if(edge.getEndNode().equals(n2)){
               res = true;
            }
        }
        return res;
    }


    // function returns ArrayList of permutations
    public ArrayList<ArrayList<Integer>> permute(List<Integer> nums) { 
        ArrayList<ArrayList<Integer>> results = new ArrayList<ArrayList<Integer>>();
        if (nums == null || nums.size() == 0) {
            return results;
        }
        ArrayList<Integer> result = new ArrayList<>();
        dfs(nums, results, result);
        return results;
    }
    

    
    public void dfs(List<Integer> nums, ArrayList<ArrayList<Integer>> results, ArrayList<Integer> result) { 
        if (nums.size() == result.size()) {
            ArrayList<Integer> temp = new ArrayList<>(result);
            results.add(temp);
        }        
        for (Integer n: nums){
            if (!result.contains(n)) {
                result.add(n);
                dfs(nums, results, result);
                result.remove(result.size() - 1);
            }
        }
    }


    
    public void simplifyGraph() {
        ArrayList<Edge> result;
        ArrayList<Edge> minEdges;
        for (Node node : nodes) {
            result = new ArrayList<Edge>();
            for (int i = 0; i < nodes.size(); i++){
                minEdges = new ArrayList<Edge>();
                for (Edge edge : node.getEdges()) {
                    if (edge.getEndNode().equals(nodes.get(i))) {
                        minEdges.add(edge);
                    }
                } 
                if(minEdges.size() != 0){
                    Long min = minEdges.get(0).getDuration();
                    Edge minEdge = minEdges.get(0);
                for(Edge edge: minEdges){
                    if (edge.getDuration() < min) {
                        min = edge.getDuration();
                        minEdge = edge;
                    }
                }
                result.add(minEdge);
                }
            }      
            node.setEdges(result);
        }
    }

           /* int counter = 0;






            for (Edge edge0 : minEdges) {
                Edge minEdge = edge0;
                for (Edge edge : node.getEdges()) {
                    if (!edge.getTravelMode().equals(edge0.getTravelMode()) && edge0.getEndNode().equals(edge.getEndNode()) && edge.getDuration() < minEdge.getDuration()) {
                        minEdge = edge;
                    }
                }
                minEdges.set(counter, minEdge);
                counter++;
            }
            node.setEdges(minEdges);
        
    }*/

}
