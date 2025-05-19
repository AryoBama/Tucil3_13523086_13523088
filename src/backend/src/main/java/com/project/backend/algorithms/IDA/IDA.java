package com.project.backend.algorithms.IDA;

import java.util.HashSet;
import java.util.List;

import com.project.backend.heuristic.CountHeuristic;
import com.project.backend.models.Board;
import com.project.backend.models.BoardNode;
import com.project.backend.models.BoardState;
import com.project.backend.models.Car;


public class IDA {
    boolean foundSolution;
    private int cntNode;
    private HashSet<String> visited;

    public IDA(){
        this.foundSolution = false;
        cntNode = 0;
        visited = new HashSet<>();
    }

    public int solveIDA(Board b ,CountHeuristic heuristic, List<BoardState> result){

        int threshold = 1 + b.getBlockingCar().size();
        int maxMove = estimateMaxMoves(b);
        BoardNode resultNode = null;

        while(!foundSolution && threshold <= maxMove){
            visited.clear();

            resultNode = solveIDA(new BoardNode(b, 0, null, 0, null), heuristic, threshold);
            System.out.println(threshold);
            threshold++;
        }
        
        if(!foundSolution){
            System.out.println("No solution");
            return cntNode;
        }
        Board finalBoard = resultNode.getBoard();
        Board newBoard = new Board(finalBoard);
        newBoard.finalMove();
        resultNode = new BoardNode(newBoard,0,0,resultNode,0,'P');
        while(resultNode.getParent() != null){
            result.addFirst(resultNode.getState());
            resultNode =  resultNode.getParent();
        }
        return cntNode;

    }

    public BoardNode solveIDA(BoardNode currentNode,CountHeuristic heuristic, int threshold){
        Board currentBoard = currentNode.getBoard();
        String keyState = encode(currentBoard);
        int f = currentNode.getG() +  currentNode.getH();
        if (currentBoard.isSolve()){
            foundSolution = true;
            return currentNode;
        }
        if (f > threshold){
            return null;
        }
        if(visited.contains(keyState)){
            return null;
        }
        visited.add(keyState);
        
        cntNode++;
        for (Car car : currentBoard.getCars().values()){
            int startRow = car.getStartRow();
            int startCol = car.getStartCol();
            int nextStep = 0;

            if (car.getOrientation().equals("horizontal")){

                // Gerak ke kanan
                while(startCol + car.getLength() + nextStep < currentBoard.getWidth()  && currentBoard.isSpaceEmpty(startRow, startCol + car.getLength() + nextStep)){ // Pake while biar mastiin gerak ampe mentok
                    nextStep++;
                }

                if (nextStep != 0){
                    Board newBoard = new Board(currentBoard);
                    newBoard.move(car.getId(), nextStep);

                    BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard), currentNode.getG() + 1,currentNode, nextStep, car.getId());

                    BoardNode result = solveIDA(nextNode, heuristic, threshold);
                    if (result != null){
                        return result;
                    }
                }

                nextStep = 0;
                // Gerak ke kiri
                while(startCol - 1 + nextStep >= 0 && currentBoard.isSpaceEmpty(startRow, startCol + nextStep - 1)){ // Pake while biar mastiin gerak ampe mentok
                    nextStep--;
                }

                if (nextStep != 0){
                    Board newBoard = new Board(currentBoard);
                    newBoard.move(car.getId(), nextStep);

                    BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard), currentNode.getG() + 1,currentNode, nextStep, car.getId());

                    BoardNode result = solveIDA(nextNode, heuristic, threshold);
                    if (result != null){
                        return result;
                    }
                }
            }else{
                // Gerak ke bawah
                while(startRow + car.getLength() + nextStep < currentBoard.getHeight() && currentBoard.isSpaceEmpty(startRow + car.getLength() + nextStep, startCol)){ // Pake while biar mastiin gerak ampe mentok
                    nextStep++;
                }

                if (nextStep != 0){
                    Board newBoard = new Board(currentBoard);
                    newBoard.move(car.getId(), nextStep);

                    BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard), currentNode.getG() + 1,currentNode, nextStep, car.getId());

                    BoardNode result = solveIDA(nextNode, heuristic, threshold);
                    if (result != null){
                        return result;
                    }
                }

                nextStep = 0;
                // Gerak ke atas
                while( startRow + nextStep - 1>= 0 && currentBoard.isSpaceEmpty(startRow + nextStep - 1, startCol)){ // Pake while biar mastiin gerak ampe mentok
                    nextStep--;
                }
                if (nextStep != 0){
                    Board newBoard = new Board(currentBoard);
                    newBoard.move(car.getId(), nextStep);

                    BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard), currentNode.getG() + 1,currentNode, nextStep, car.getId());

                    BoardNode result = solveIDA(nextNode, heuristic, threshold);
                    if (result != null){
                        return result;
                    }
                }             
            }
        }
        return null;
    }

    private int estimateMaxMoves(Board board) {
        int maxMoves = 0;

        for (Car car : board.getCars().values()) {
            int length = car.getLength();
            int multiplier = 2; 

            if (car.getOrientation().equals("horizontal")) {
                // posisi horizontal: (w - Li) * (h - 1)
                int movablePositions = board.getWidth() - length;
                maxMoves += multiplier * movablePositions * multiplier;
            } else {
                // posisi vertikal: (h - Li) * (w - 1)
                int movablePositions = board.getHeight() - length;
                maxMoves += multiplier * movablePositions * multiplier;
            }
        }

        return maxMoves;
    }

    String encode(Board b) {
        StringBuilder sb = new StringBuilder();
        for (Car c : b.getCars().values()) {
            sb.append(c.getStartRow()).append(",").append(c.getStartCol()).append(";");
        }
        return sb.toString();
    }
}
