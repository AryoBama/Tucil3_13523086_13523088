package com.project.backend.models;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BoardRequest {
    private int width;
    private int height;
    private List<List<String>> grid;
    private int exitRow;
    private int exitCol;

    public BoardRequest() {}

    public int getWidth() { return width; }
    public void setWidth(int width) { this.width = width; }

    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }

    public List<List<String>> getGrid() { return grid; }
    public void setGrid(List<List<String>> grid) { this.grid = grid; }

    public int getExitRow() { return exitRow; }
    public void setExitRow(int exitRow) { this.exitRow = exitRow; }

    public int getExitCol() { return exitCol; }
    public void setExitCol(int exitCol) { this.exitCol = exitCol; }

    public Board convertToBoard(){

        Map<Character, List<Pair<Integer, Integer>>> cars = new HashMap<>();
        Board board = new Board(this.width, this.height, this.exitRow, this.exitCol);

        for (Integer i = 0; i < this.height; i++) {
            for (Integer j = 0; j < this.width; j++) {

                Character c = grid.get(i).get(j).charAt(0);

                if (c == ' ' || c == '.') continue;

                Character carChar = c;
                if (cars.containsKey(carChar)) {
                    cars.get(carChar).add(new Pair<>(i, j));
                } else {
                    List<Pair<Integer, Integer>> list = new ArrayList<>();
                    list.add(new Pair<>(i, j));
                    cars.put(carChar, list);
                }
            }
        }
        for (Map.Entry<Character, List<Pair<Integer, Integer>>> entry : cars.entrySet()) {
            Character carId = entry.getKey();
            List<Pair<Integer, Integer>> value = entry.getValue();
            String orientation;
            if (value.get(0).getFirst().equals(value.get(1).getFirst())) {
                orientation = "horizontal";
            } else {
                orientation = "vertical";
            }

            Car car = new Car(carId, value.size(), orientation);
            if(!board.addCar(car, value.get(0).getFirst(), value.get(0).getSecond())){
                System.err.println(carId);
            }

        }
        
        return board;
    }
}
