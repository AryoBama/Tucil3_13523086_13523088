package com.project.backend.algorithms.AStar;

import com.project.backend.heuristic.BlockingCar;
import com.project.backend.heuristic.CountHeuristic;
import com.project.backend.models.Board;
import com.project.backend.models.Car;

public class Test {
    public static void main(String[] args){
        Board board = new Board(6,6,2,-1);

        Car car1 = new Car('A', 0, 0, 2,"vertical");
        Car car2 = new Car('B',0, 1, 3,"vertical");
        Car car3 = new Car('C',0,3, 2,"horizontal");
        Car car4 = new Car('D',1,2, 2,"vertical");
        Car car5 = new Car('E',1,5, 2,"vertical");
        Car car6 = new Car('F',2,0, 3,"vertical");
        Car car7 = new Car('G',4,1, 2,"horizontal");
        Car car8 = new Car('H',3,3, 2,"vertical");
        Car car9 = new Car('I',5,1, 2,"horizontal");
        Car car10 = new Car('J',3,4, 2,"horizontal");
        Car car11 = new Car('K',4,4, 2,"horizontal");
        Car car12 = new Car('L',5,4, 2,"horizontal");
        Car main = new Car('P', 2, 3, 2, "horizontal");

        board.addCar(car1, 0, 0);
        board.displayBoard();
        board.addCar(car2, 0, 1);
        board.displayBoard();
        board.addCar(car3, 0, 3);
        board.displayBoard();
        board.addCar(car4, 1, 2);
        board.displayBoard();
        board.addCar(car5, 1, 5);
        board.displayBoard();
        board.addCar(car6, 2, 0);
        board.displayBoard();
        board.addCar(car7, 4, 1);
        board.displayBoard();
        board.addCar(car8, 3, 3);
        board.displayBoard();
        board.addCar(car9, 5, 1);   // <- Ini bisa menimpa car7, periksa bentrokan
        board.displayBoard();
        board.addCar(car10, 3, 4);  // <- Ini tabrakan dengan car4 atau car8
        board.displayBoard();
        board.addCar(car11, 4, 4);  // <- Overlap dengan car7
        board.displayBoard();
        board.addCar(car12, 5, 4);  // <- Overlap juga
        board.displayBoard();
        board.addCar(main, 2, 3);
        board.displayBoard();

        CountHeuristic heuristic = new BlockingCar();
        System.out.println("Banyak mobil penghalang: " + heuristic.getValue(board));

        board.move('D', -1);
        board.displayBoard();
        System.out.println("Banyak mobil penghalang: " + heuristic.getValue(board));

        board.move('B', 1);
        board.displayBoard();
        System.out.println("Banyak mobil penghalang: " + heuristic.getValue(board));

        board.move('F', 1);
        board.displayBoard();
        System.out.println("Banyak mobil penghalang: " + heuristic.getValue(board));
        
        board.move('B', -1);
        board.displayBoard();
        System.out.println("Banyak mobil penghalang: " + heuristic.getValue(board));

        long startTime = System.nanoTime();

        AStar.solveAStar(board, heuristic);
        long endTime = System.nanoTime();
        long duration = endTime - startTime;
        System.out.println("Waktu eksekusi: " + duration + " nanodetik");
        System.out.println("Atau: " + (duration / 1_000_000.0) + " milidetik");
    }
}
