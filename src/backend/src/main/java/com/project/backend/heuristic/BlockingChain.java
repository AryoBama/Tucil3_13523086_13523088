package com.project.backend.heuristic;

import java.util.ArrayList;
import java.util.HashMap;

import com.project.backend.models.Board;
import com.project.backend.models.Car;
import com.project.backend.models.Pair;

public class BlockingChain implements CountHeuristic{
    
    private ArrayList<Character> visited;
    private Board b;

    public BlockingChain(Board b){
        visited = new ArrayList<>();
        this.b = b;
    }

    @Override
    public int getValue(Board b){
        this.b = b;
        this.visited.clear();
        return getMinimumStep();
    }

    private int countNeededSpace(Car c, Pair<Integer,Integer> conflictPos, boolean direction){

        // Disini kalau directionnya true dia bisa atas atau kiri tergantung orientationnya kalau false yang sebaliknya
        
        int startRow = c.getStartRow();
        int startCol = c.getStartCol();
        int conflictRow = conflictPos.getFirst();
        int conflictCol = conflictPos.getSecond();

        if (c.getOrientation().equals("horizontal")){
            if (direction){// Kalau kiri
                return startCol + c.getLength() - conflictCol;
            }else{
                return conflictCol - startCol + 1;
            }

        }else{

            if (direction){ //kalau atas
                return startRow + c.getLength() - conflictRow;

            }
            return conflictRow - startRow + 1;
        }
    }


    private int getMinimumStep(){

        Car mainCar = b.getCarById('P');

        int value = 1;

        int mainRow = mainCar.getStartRow();
        int mainCol = mainCar.getStartCol();
        int mainLength = mainCar.getLength();
        Character[][] grid = b.getGrid();
        HashMap<Character, Pair<Integer,Integer>> blockingCars = b.getBlockingCar();

        for (HashMap.Entry<Character, Pair<Integer,Integer>> entry : blockingCars.entrySet()){
            Car car = b.getCarById(entry.getKey());
            int needSpaceForward = countNeededSpace(car, entry.getValue(), false);
            int needSpaceBack = countNeededSpace(car, entry.getValue(), true);
            value += getBlockingValue(car, needSpaceForward, needSpaceBack);
            System.out.println();
        }

        return value;
    }

    public int getBlockingValue(Car car, int spaceNeedForward, int spaceNeedBack){

        Character carId = car.getId();

        if(visited.contains(carId) || carId == 'P'){
            return 0;
        }
        
        this.visited.add(carId);

        int value = 1;

        int valueForward = 0, valueBack = 0;

        boolean canMoveForward = b.isValidMove(carId,spaceNeedForward);
        boolean canMoveBack = b.isValidMove(carId,spaceNeedBack*-1);


        if (isWallBlocking(carId, spaceNeedForward)){
            valueForward =  Integer.MAX_VALUE;
        }else if(!canMoveForward){
            ArrayList<Pair<Integer,Integer>> nextConflict = new ArrayList<>();
            ArrayList<Car> nextCars = getNextCars(car, spaceNeedForward, nextConflict);
            int cnt = 0;
            for (Car nextCar : nextCars){
                Pair<Integer,Integer> pos = nextConflict.get(cnt);
                int nextSpaceForward = countNeededSpace(nextCar, pos, false);
                int nextSpaceBack = countNeededSpace(nextCar, pos, true);
                valueForward += getBlockingValue(nextCar, nextSpaceForward, nextSpaceBack);
                cnt++;
            }
        }

        if(isWallBlocking(carId, spaceNeedBack*-1)){
            valueBack = Integer.MAX_VALUE;
        }else if(!canMoveBack){
            ArrayList<Pair<Integer,Integer>> nextConflict = new ArrayList<>();
            ArrayList<Car> nextCars = getNextCars(car, spaceNeedBack*-1, nextConflict);
            int cnt = 0;
            for (Car nextCar : nextCars){
                Pair<Integer,Integer> pos = nextConflict.get(cnt);
                int nextSpaceForward = countNeededSpace(nextCar, pos, false);
                int nextSpaceBack = countNeededSpace(nextCar, pos, true);
                valueBack += getBlockingValue(nextCar, nextSpaceForward, nextSpaceBack);
                cnt++;
            }
        }

        value += Math.min(valueForward, valueBack);
        return value;
    }

    private boolean isWallBlocking(Character carId, int steps) {
        Car car = b.getCars().get(carId);
        if (car == null || steps == 0) return true; 

        if (car.getOrientation().equals("horizontal")) {
            int newCol = car.getStartCol() + steps;

            if (steps < 0) {
                return newCol < 0;
            }
            return (newCol + car.getLength() > b.getWidth());

        } else {
            int newRow = car.getStartRow() + steps;

            if (steps < 0) {
                return newRow < 0;
            }
            return (newRow + car.getLength() > b.getHeight());
        }
    }

    private ArrayList<Car> getNextCars(Car currentCar, int steps, ArrayList<Pair<Integer,Integer>> nextConflictPos){
        Character[][] grid = b.getGrid();
        Character nextCar;
        ArrayList<Car> result = new ArrayList<>();
        int startRow = currentCar.getStartRow();
        int startCol = currentCar.getStartCol();

        int nextRow = startRow , nextCol = startCol;
        if (currentCar.getOrientation().equals("horizontal")){
            for (int i = 1; i <= Math.abs(steps);i++){
                Pair<Integer,Integer> pair = new Pair<>(startRow, startCol);
                if (steps > 0){
                    nextCol =  startCol + currentCar.getLength() - 1 + i;
                    if(b.isSpaceEmpty(nextRow, nextCol)){
                        continue;
                    }
                    nextCar = grid[nextRow][nextCol];
                    result.add(b.getCarById(nextCar));
                }else{
                    nextCol = startCol - i;
                    if(b.isSpaceEmpty(nextRow, nextCol)){
                        continue;
                    }
                    nextCar = grid[nextRow][nextCol];
                    result.add(b.getCarById(nextCar));
                }
                pair.setSecond(nextCol);
                nextConflictPos.add(pair);
            }
        }else{
            for (int i = 1; i <= Math.abs(steps); i++){
                Pair<Integer,Integer> pair = new Pair<>(startRow, startCol);
                if (steps > 0){ 
                    nextRow = startRow + currentCar.getLength() - 1 + i;
                    if(b.isSpaceEmpty(nextRow, nextCol)){
                        continue;
                    }
                    nextCar = grid[nextRow][nextCol];
                    result.add(b.getCarById(nextCar));
                }else{
                    nextRow = startRow - i;
                    try {
                        
                        if(b.isSpaceEmpty(nextRow, nextCol)){
                            continue;
                        }
                    } catch (Exception e) {
                        b.displayBoard();
                        System.out.println(currentCar.getId() + " steps " + steps);
                        System.out.println(nextRow + " " + nextCol);
                    }
                    nextCar = grid[nextRow][nextCol];
                    result.add(b.getCarById(nextCar));
                }
                pair.setFirst(nextRow);
                nextConflictPos.add(pair);
            }

        }
        // System.out.println(currentCar.getId() + "BUTUH" + steps);
        // System.out.println("Lanjt: " + nextCar);
        // System.out.println(nextRow + " " + nextCol);
        // if (nextCar == '.'){
        //     System.out.println("LOH KOK SALAH");
        //     return null;
        // }
        return result;
    }

}
