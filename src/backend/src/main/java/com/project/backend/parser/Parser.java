package com.project.backend.parser;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.project.backend.models.Board;
import com.project.backend.models.Car;
import com.project.backend.models.Pair;

public class Parser {
    public static Board ReadInput() {

        int cntLine = 1;
        int width = 0;
        int height = 0;
        int N;
        Integer x;
        Integer y = 0;
        List<List<Character>> grid = new ArrayList<>();
        int exitRow = 0;
        int exitCol = 0;
        Map<Character, List<Pair<Integer, Integer>>> cars = new HashMap<>();

        try (BufferedReader reader = new BufferedReader(new FileReader("C:\\Users\\AryoBama\\Jurusan\\Semester_4\\Stima\\Tucil\\Tucil3_13523086_13523088\\src\\backend\\parser\\test.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (cntLine == 1) {
                    String[] kata = line.split(" ");
                    width = Integer.parseInt(kata[0]);
                    height = Integer.parseInt(kata[1]);

                    // Inisialisasi grid sebagai List<List<Character>>
                    for (int i = 0; i < height + 1; i++) {
                        List<Character> row = new ArrayList<>();
                        for (int j = 0; j < width + 1; j++) {
                            row.add(' ');
                        }
                        grid.add(row);
                    }

                    System.out.println("Width: " + width);
                    System.out.println("Height: " + height);

                } else if (cntLine == 2) {
                    String[] kata = line.split(" ");
                    N = Integer.parseInt(kata[0]);
                    System.out.println("N: " + N);

                } else {
                    x = 0;
                    // System.out.println("Y: " + y);
                    for (Character c : line.toCharArray()) {
                        grid.get(y).set(x, c);
                        x++;
                    }
                    y++;
                }
                cntLine++;
            }

            for (int i = 0; i < height + 1; i++) {
                for (int j = 0; j < width + 1; j++) {
                    if (grid.get(i).get(j) == 'K') {
                        exitRow = i;
                        exitCol = j;
                        break;
                    }
                }
            }


            Board board;
            System.out.println("ExitRow: " + exitRow);
            System.out.println("ExitCol: " + exitCol);
            System.out.println("Exit: " + grid.get(0));
        
            if (exitRow == 0  && isExitInTop(grid.get(0))) { // Kalau K paling atas

                exitRow = -1;
                board = new Board(width, height, exitRow, exitCol);
                for (Integer i = 1; i < height + 1; i++) {
                    for (Integer j = 0; j < width; j++) {
                        if (grid.get(i).get(j) == ' ' || grid.get(i).get(j) == '.') continue;

                        Character carChar = grid.get(i).get(j);
                        if (cars.containsKey(carChar)) {
                            cars.get(carChar).add(new Pair<>(i - 1, j));
                        } else {
                            List<Pair<Integer, Integer>> list = new ArrayList<>();
                            list.add(new Pair<>(i - 1, j));
                            cars.put(carChar, list);
                        }
                    }
                }
            } else if (exitCol == 0 && exitRow < height) { // Kalau exit di kiri
                exitCol = -1;
                board = new Board(width, height, exitRow, exitCol);
                for (Integer i = 0; i < height; i++) {
                    for (Integer j = 1; j < width + 1; j++) {
                        if (grid.get(i).get(j) == ' ' || grid.get(i).get(j) == '.') continue;

                        Character carChar = grid.get(i).get(j);
                        if (cars.containsKey(carChar)) {
                            cars.get(carChar).add(new Pair<>(i, j - 1));
                        } else {
                            List<Pair<Integer, Integer>> list = new ArrayList<>();
                            list.add(new Pair<>(i, j - 1));
                            cars.put(carChar, list);
                        }
                    }
                }
            } else { // Kalau exit bukan di sisi
                board = new Board(width, height, exitRow, exitCol);
                for (Integer i = 0; i < height; i++) {
                    for (Integer j = 0; j < width; j++) {
                        if (grid.get(i).get(j) == ' ' || grid.get(i).get(j) == '.') continue;

                        Character carChar = grid.get(i).get(j);
                        if (cars.containsKey(carChar)) {
                            cars.get(carChar).add(new Pair<>(i, j));
                        } else {
                            List<Pair<Integer, Integer>> list = new ArrayList<>();
                            list.add(new Pair<>(i, j));
                            cars.put(carChar, list);
                        }
                    }
                }
            }

            // Masukkan mobil-mobil ke board
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

        } catch (IOException e) {
            e.printStackTrace();
        }

        return new Board(0, 0, 0, 0);
    }
    
    private static boolean isExitInTop(List<Character> row) {
        for (Character c : row) {
            if (!c.equals('K') && !c.equals(' ')) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        Board board = ReadInput();
        board.displayBoard();
    }
}
