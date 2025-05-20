package com.project.backend.algorithms.Beam;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;

import com.project.backend.heuristic.CountHeuristic;
import com.project.backend.models.Board;
import com.project.backend.models.BoardNode;
import com.project.backend.models.BoardState;
import com.project.backend.models.Car;

public class Beam {
    
    public static int solveBeamSearch(Board board, CountHeuristic heuristic, List<BoardState> result, int beamWidth){

        boolean found = false;

        Comparator<BoardNode> minHeap = Comparator.comparingInt(BoardNode::getH);
        PriorityQueue<BoardNode> pq = new PriorityQueue<>(minHeap);

        BoardNode root = new BoardNode(board, 0, null, 0, null);
        Set<BoardState> visited = new HashSet<>();
        BoardNode currentNode = null;

        pq.add(root);

        while (!pq.isEmpty()) {
            List<BoardNode> currentLevel = new java.util.ArrayList<>(pq);
            pq.clear();

            PriorityQueue<BoardNode> children = new PriorityQueue<>(minHeap);

            for (BoardNode parentNode : currentLevel) {
                currentNode = parentNode;
                Board currentBoard = currentNode.getBoard();

                if (currentBoard.isSolve()) {
                    found = true;
                    Board newBoard = new Board(currentBoard);
                    newBoard.finalMove();
                    currentNode = new BoardNode(newBoard, 0, 0, currentNode, 0, 'P');
                    break;
                }

                Map<Character, Car> cars = currentBoard.getCars();

                for (Car car : cars.values()) {
                    int startRow = car.getStartRow();
                    int startCol = car.getStartCol();
                    int step;

                    if (car.getOrientation().equals("horizontal")) {
                        // Gerak ke kanan
                        step = 1;
                        while (startCol + car.getLength() + step - 1 < currentBoard.getWidth() &&
                               currentBoard.isSpaceEmpty(startRow, startCol + car.getLength() + step - 1)) {

                            Board newBoard = new Board(currentBoard);
                            newBoard.move(car.getId(), step);

                            BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard),
                                    currentNode.getG() + 1, currentNode, step, car.getId());

                            BoardState nextState = new BoardState(newBoard, step, car.getId());
                            if (!visited.contains(nextState)) {
                                children.add(nextNode);
                                visited.add(nextState);
                            }
                            step++;
                        }

                        // Gerak ke kiri
                        step = -1;
                        while (startCol + step >= 0 &&
                               currentBoard.isSpaceEmpty(startRow, startCol + step)) {

                            Board newBoard = new Board(currentBoard);
                            newBoard.move(car.getId(), step);

                            BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard),
                                    currentNode.getG() + 1, currentNode, step, car.getId());

                            BoardState nextState = new BoardState(newBoard, step, car.getId());
                            if (!visited.contains(nextState)) {
                                children.add(nextNode);
                                visited.add(nextState);
                            }
                            step--;
                        }
                    } else {
                        // Gerak ke bawah
                        step = 1;
                        while (startRow + car.getLength() + step - 1 < currentBoard.getHeight() &&
                               currentBoard.isSpaceEmpty(startRow + car.getLength() + step - 1, startCol)) {

                            Board newBoard = new Board(currentBoard);
                            newBoard.move(car.getId(), step);

                            BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard),
                                    currentNode.getG() + 1, currentNode, step, car.getId());

                            BoardState nextState = new BoardState(newBoard, step, car.getId());
                            if (!visited.contains(nextState)) {
                                children.add(nextNode);
                                visited.add(nextState);
                            }
                            step++;
                        }

                        // Gerak ke atas
                        step = -1;
                        while (startRow + step >= 0 &&
                               currentBoard.isSpaceEmpty(startRow + step, startCol)) {

                            Board newBoard = new Board(currentBoard);
                            newBoard.move(car.getId(), step);

                            BoardNode nextNode = new BoardNode(newBoard, heuristic.getValue(newBoard),
                                    currentNode.getG() + 1, currentNode, step, car.getId());

                            BoardState nextState = new BoardState(newBoard, step, car.getId());
                            if (!visited.contains(nextState)) {
                                children.add(nextNode);
                                visited.add(nextState);
                            }
                            step--;
                        }
                    }
                }
            }

            if (found) break;

            int added = 0;
            while (!children.isEmpty() && added < beamWidth) {
                pq.add(children.poll());
                added++;
            }
        }

        if (!found || currentNode == null) {
            System.out.println("Tidak ada solusi yang ditemukan");
            return visited.size();
        }

        while (currentNode.getParent() != null) {
            result.addFirst(currentNode.getState());
            currentNode = currentNode.getParent();
        }

        return visited.size();
    }
}
