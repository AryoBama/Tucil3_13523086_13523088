package com.project.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.algorithms.AStar.AStar;
import com.project.backend.algorithms.Beam.Beam;
import com.project.backend.algorithms.GBFS.GBFS;
import com.project.backend.algorithms.IDA.IDA;
import com.project.backend.algorithms.UCS.UCS;
import com.project.backend.heuristic.BlockingCar;
import com.project.backend.heuristic.BlockingChain;
import com.project.backend.heuristic.CountHeuristic;
import com.project.backend.models.Board;
import com.project.backend.models.BoardRequest;
import com.project.backend.models.BoardState;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/solve")
public class SolveController {
    @PostMapping("/UCS")
    public ResponseEntity<Map<String, Object>>SolveWithUCS(@RequestBody BoardRequest request) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        
        List<BoardState> result = new LinkedList<>();
        long startTime = System.nanoTime();
        Integer cntNode = UCS.solveUCS(board, result);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;
        System.out.println("Durasinya: " + duration);

        for(BoardState node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getGrid());
            step.put("piece", node.getCar().getId());
            step.put("direction", node.getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/IDA")
    public ResponseEntity<Map<String, Object>>SolveWithIDA(@RequestBody BoardRequest request, @RequestParam String heuristic) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        CountHeuristic method;

        if (heuristic.equals("BlockingChain")){
            method = new BlockingChain(board);
        }else{
            method = new BlockingCar(board);
        }
        
        List<BoardState> result = new LinkedList<>();
        long startTime = System.nanoTime();
        IDA ida = new IDA();
        Integer cntNode = ida.solveIDA(board, method, result);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;
        System.out.println("Durasinya: " + duration);

        for(BoardState node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getGrid());
            step.put("piece", node.getCar().getId());
            step.put("direction", node.getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/AStar")
    public ResponseEntity<Map<String, Object>>SolveWithAStar(@RequestBody BoardRequest request, @RequestParam String heuristic) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        CountHeuristic method;

        if (heuristic.equals("BlockingChain")){
            method = new BlockingChain(board);
        }else{
            method = new BlockingCar(board);
        }
        
        List<BoardState> result = new LinkedList<>();
        long startTime = System.nanoTime();
        Integer cntNode = AStar.solveAStar(board, method,result);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;
        System.out.println("Durasinya: " + duration);

        for(BoardState node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getGrid());
            step.put("piece", node.getCar().getId());
            step.put("direction", node.getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/GBFS")
    public ResponseEntity<Map<String, Object>>SolveWithGBFS(@RequestBody BoardRequest request, @RequestParam String heuristic) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        CountHeuristic method;

        if (heuristic.equals("BlockingChain")){
            method = new BlockingChain(board);
        }else{
            method = new BlockingCar(board);
        }
        
        List<BoardState> result = new LinkedList<>();
        long startTime = System.nanoTime();
        Integer cntNode = GBFS.solveGBFS(board, method,result);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;
        System.out.println("Durasinya: " + duration);

        for(BoardState node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getGrid());
            step.put("piece", node.getCar().getId());
            step.put("direction", node.getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/Beam")
    public ResponseEntity<Map<String, Object>>SolveWithBeam(@RequestBody BoardRequest request, @RequestParam String heuristic) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        CountHeuristic method;

        if (heuristic.equals("BlockingChain")){
            method = new BlockingChain(board);
        }else{
            method = new BlockingCar(board);
        }
        
        List<BoardState> result = new LinkedList<>();
        long startTime = System.nanoTime();
        int beamWidth = 20;
        Integer cntNode = Beam.solveBeamSearch(board, method,result,beamWidth);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;
        System.out.println("Durasinya: " + duration);

        for(BoardState node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getGrid());
            step.put("piece", node.getCar().getId());
            step.put("direction", node.getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }
}

