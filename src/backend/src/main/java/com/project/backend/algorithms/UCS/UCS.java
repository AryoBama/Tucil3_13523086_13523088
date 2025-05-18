package com.project.backend.algorithms.UCS;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

import com.project.backend.models.Board;
import com.project.backend.models.BoardNode;
import com.project.backend.models.BoardState;
import com.project.backend.models.Car;

public class UCS {
    
    public static int solveUCS(Board board, List<BoardNode> result){

        boolean found = false;

        Comparator<BoardNode> minHeap = (a, b) -> Integer.compare(a.getG(), b.getG());

        PriorityQueue<BoardNode> pq = new PriorityQueue<>(minHeap);

        BoardNode root = new BoardNode(board, 0, null, 0, null);

        Set<BoardState> visited = new HashSet<>();

        BoardNode currentNode = null;

        pq.add(root);

        while (!pq.isEmpty()){

            currentNode = pq.poll();
            
            Board currentBoard = currentNode.getBoard();

            if (currentBoard.isSolve()){
                found = true;
                break;
            }
            Map<Character, Car> cars = currentBoard.getCars();

            for (Car car : cars.values()){
                int startRow = car.getStartRow();
                int startCol = car.getStartCol();
                int step = 0;

                if (car.getOrientation().equals("horizontal")){

                    // Gerak ke kanan
                    while(startCol + car.getLength() + step < currentBoard.getWidth()  && currentBoard.isSpaceEmpty(startRow, startCol + car.getLength() + step)){ // Pake while biar mastiin gerak ampe mentok
                        step++;
                    }

                    if (step != 0){
                        Board newBoard = new Board(currentBoard);
                        newBoard.move(car.getId(), step);

                        BoardNode nextNode = new BoardNode(newBoard,currentNode.getG() + 1, currentNode, step, car.getId());
                        BoardState nextState = new BoardState(newBoard, step, car.getId());

                        if(visited.contains(nextState)){
                            continue;
                        }
                        pq.add(nextNode);
                        visited.add(nextState);
                    
                    }

                    step = 0;
                    // Gerak ke kiri
                    while(startCol - 1 + step >= 0 && currentBoard.isSpaceEmpty(startRow, startCol + step - 1)){ // Pake while biar mastiin gerak ampe mentok
                        step--;
                    }

                    if (step != 0){
                        Board newBoard = new Board(currentBoard);
                        newBoard.move(car.getId(), step);

                        BoardNode nextNode = new BoardNode(newBoard,currentNode.getG() + 1, currentNode, step, car.getId());
                        BoardState nextState = new BoardState(newBoard, step, car.getId());

                        if(visited.contains(nextState)){
                            continue;
                        }
                        pq.add(nextNode);
                        visited.add(nextState);
                    }
                }else{
                    // Gerak ke bawah
                    while(startRow + car.getLength() + step < currentBoard.getHeight() && currentBoard.isSpaceEmpty(startRow + car.getLength() + step, startCol)){ // Pake while biar mastiin gerak ampe mentok
                        step++;
                    }

                    if (step != 0){
                        Board newBoard = new Board(currentBoard);
                        newBoard.move(car.getId(), step);

                        BoardNode nextNode = new BoardNode(newBoard,currentNode.getG() + 1, currentNode, step, car.getId());
                        BoardState nextState = new BoardState(newBoard, step, car.getId());

                        if(visited.contains(nextState)){
                            continue;
                        }
                        pq.add(nextNode);
                        visited.add(nextState);
                    }

                    step = 0;
                    // Gerak ke atas
                    while( startRow + step - 1>= 0 && currentBoard.isSpaceEmpty(startRow + step - 1, startCol)){ // Pake while biar mastiin gerak ampe mentok
                        step--;
                    }

                    if (step != 0){
                        Board newBoard = new Board(currentBoard);
                        newBoard.move(car.getId(), step);

                        BoardNode nextNode = new BoardNode(newBoard,currentNode.getG() + 1, currentNode, step, car.getId());
                        BoardState nextState = new BoardState(newBoard, step, car.getId());

                        if(visited.contains(nextState)){
                            continue;
                        }
                        pq.add(nextNode);
                        visited.add(nextState);
                    }                  
                }
            }
        }

        if(!found || currentNode == null){
            System.out.println("Tidak ada solusi yang ditemukan");
            return visited.size();
        }

        while(currentNode.getParent() != null){
            result.addFirst(currentNode);
            currentNode =  currentNode.getParent();
        }
        // int cnt = 1;
        // for(BoardNode node: result){
        //     System.out.println("Gerakan ke- " + cnt);
        //     node.getState().displayState();
        //     System.out.println("");
        //     cnt++;
        // }
        return visited.size();
    }
}
