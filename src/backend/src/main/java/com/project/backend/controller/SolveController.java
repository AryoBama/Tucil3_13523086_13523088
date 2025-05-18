package com.project.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.LinkedList;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.algorithms.UCS.UCS;
import com.project.backend.models.Board;
import com.project.backend.models.BoardNode;
import com.project.backend.models.BoardRequest;

@RestController
@RequestMapping("/api/solve")
public class SolveController {
    @CrossOrigin(origins = "http://localhost:3000") 
    @PostMapping("/UCS")
    public ResponseEntity<Map<String, Object>>SolveWithUCS(@RequestBody BoardRequest request) {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> steps = new ArrayList<>();

        
        Board board = request.convertToBoard();

        long startTime = System.nanoTime();

        List<BoardNode> result = new LinkedList<>();
        Integer cntNode = UCS.solveUCS(board, result);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        duration /= 1_000_000.0;

        for(BoardNode node : result){
            Map<String, Object> step = new HashMap<>();
            step.put("board", node.getState().getGrid());
            step.put("piece", node.getState().getCar().getId());
            step.put("direction", node.getState().getDirections());
            steps.add(step);
        }
        board.displayBoard();

        response.put("steps", steps);
        response.put("time", duration);
        response.put("cntNode", cntNode);
        return ResponseEntity.ok(response);
    }
}

