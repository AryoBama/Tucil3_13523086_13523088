package com.project.backend.heuristic;

import com.project.backend.models.Board;

public class BlockingCar implements CountHeuristic {

    private Board b;

    public BlockingCar(Board b){
        this.b = b;
    }

    @Override
    public int getValue(Board b){
        this.b = b;
        return b.getBlockingCar().size() + 1;
    }
}
