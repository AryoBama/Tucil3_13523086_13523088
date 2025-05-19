package com.project.backend.heuristic;

import com.project.backend.models.Board;

public interface CountHeuristic {
    
    public abstract int getValue(Board b);
}
