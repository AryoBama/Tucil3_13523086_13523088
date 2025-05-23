package com.project.backend.models;

import java.util.HashMap;
import java.util.Map;


public class Board{

    private int width;
    private int height; 
    private Map<Character,Car> cars;
    private int exitRow;
    private int exitCol;
    private Character[][] grid;

    public Board(int width, int height, int exitRow,int exitCol){
        this.width = width;
        this.height = height;
        this.cars = new HashMap<>();
        this.exitRow = exitRow;
        this.exitCol = exitCol;
        this.grid = new Character[height][width];
        for (int i = 0; i < height; i++){
            for (int j = 0; j < width; j++){
                this.grid[i][j] = '.';
            }
        }
   }

   public Board(Board other){

        this.width = other.width;
        this.height = other.height;
        this.cars = new HashMap<>();
        for (Car car : other.cars.values()) {
            this.cars.put(car.getId(), new Car(car));
        }
        this.exitRow = other.exitRow;
        this.exitCol = other.exitCol;
        this.grid = new Character[other.height][other.width];
        for (int i = 0; i < other.height; i++){
            for (int j = 0; j < other.width; j++){
                this.grid[i][j] = other.grid[i][j]; 
            }
        }
   }

    public boolean addCar(Car car, int startRow, int startCol){

        if (startRow >= height || startCol >= width){
            System.err.println("Tidak boleh melebihi batas papan");
            return false;
        }

        if (car.getOrientation().equals("horizontal")) {
            for (int i = startCol; i < startCol + car.getLength(); i++) {
                if (this.grid[startRow][i] != '.') {
                    System.out.println("Tertabrak");
                    return false;
                }
            }
        }else{
            for (int i = startRow; i < startRow + car.getLength(); i++) {
                if (this.grid[i][startCol] != '.') {
                    System.out.println("Tertabrak");
                    return false;
                }
            }
        }

        car.setStartRow(startRow);
        car.setStartCol(startCol);

        if (car.getOrientation().equals("horizontal")) {
            for (int i = 0; i < car.getLength(); i++) {
                this.grid[startRow][startCol + i] = car.getId();
            }
        } else {
            for (int i = 0; i < car.getLength(); i++) {
                this.grid[startRow + i][startCol] = car.getId();
            }
        }

        this.cars.put(car.getId(), car);
        return true;
    }

    public int finalMove(){

        Car main = getCarById('P');
        int startCol = main.getStartCol();
        int startRow = main.getStartRow();
        if (!isSolve()){
            return 0;
        }
        for (int i = 0; i < this.width; i++){
            for (int j = 0; j < this.height; j++){
                if (grid[i][j] == 'P'){
                    grid[i][j] = '.';
                }
            }
        }

        if (main.getOrientation().equals("horizontal")){
            return startCol < exitCol ? 1 : -1;
        }else{
            return startRow < exitRow ? 1 : -1;
        }
    }

    public boolean removeCar(Character carId){
        if (!cars.containsKey(carId)){
            return false;
        }
        Car car = cars.get(carId);

        int startCol = car.getStartCol();
        int startRow = car.getStartRow();

        if (car.getOrientation().equals("horizontal")) {
            for (int i = 0; i < car.getLength(); i++) {
                this.grid[startRow][i + startCol] = '.';
            }
        }else{
            for (int i = 0; i < car.getLength(); i++) {
                    this.grid[i + startRow][startCol] = '.';
            }
        }

        cars.remove(carId);
        return true;
    }

    public boolean isValidMove(Character carId, int steps) {
        Car car = cars.get(carId);
        if (car == null) return false;

        if (car.getOrientation().equals("horizontal")) {
            int newCol = car.getStartCol() + steps;

            if (newCol < 0 || newCol + car.getLength() > this.width) {

                return false;
            }

            if (steps > 0) {
                for (int i = 0; i < steps; i++) {
                    int checkCol = car.getStartCol() + car.getLength() + i;
                    if (checkCol < this.width && !isSpaceEmpty(car.getStartRow(), checkCol)) {
                        return false;
                    }
                }
            } else if (steps < 0) {
                for (int i = 0; i > steps; i--) {
                    int checkCol = car.getStartCol() + i - 1;
                    if (checkCol >= 0 && !isSpaceEmpty(car.getStartRow(), checkCol)) {
                        return false;
                    }
                }
            } else {
                return false;  // steps == 0 tidak valid
            }

        } else { // vertical
            int newRow = car.getStartRow() + steps;

            if (newRow < 0 || newRow + car.getLength() > this.height) {
                return false;
            }

            if (steps > 0) {
                for (int i = 0; i < steps; i++) {
                    int checkRow = car.getStartRow() + car.getLength() + i;
                    if (checkRow < this.height && !isSpaceEmpty(checkRow, car.getStartCol())) {
                        return false;
                    }
                }
                
            } else if (steps < 0) {
                
                for (int i = 0; i > steps; i--) {
                    int checkRow = car.getStartRow() + i - 1;
                    if (checkRow >= 0 && !isSpaceEmpty(checkRow, car.getStartCol())) {
                        return false;
                    }
                }

            } else {
                return false;  // steps == 0 tidak valid
            }
        }

        return true;
    }

    public boolean isSpaceEmpty(int row, int col){
        return this.grid[row][col].equals('.');
    }

    public boolean move(Character carId, int steps){
        if (!this.isValidMove(carId, steps)){
            return false;
        }

        Car car = this.cars.get(carId);



        if (car.getOrientation().equals("horizontal")){

            int row = car.getStartRow();
            int col = car.getStartCol();

            for (int i = 0 ; i < car.getLength(); i++){
                this.grid[row][i + col] = '.';
            }
            car.move(steps);
            
            for (int i = 0 ; i < car.getLength(); i++){
                this.grid[row][i + car.getStartCol()] = car.getId();
            }
        }else{
            int row = car.getStartRow();
            int col = car.getStartCol();

            for (int i = 0 ; i < car.getLength(); i++){
                this.grid[i + row][col] = '.';
            }
            car.move(steps);

            for (int i = 0 ; i < car.getLength(); i++){
                this.grid[i + car.getStartRow()][col] = car.getId();
            }
        }
        return true;

    }

    public Car getCarById(Character carId){
        return cars.get(carId);
    }

    public Car getCarAt(int row, int col){
        Character id = this.grid[row][col];
        if (id == null || id == '.') return null;
        return cars.get(id);
    }

    public int getWidth(){
        return this.width;
    }

    public int getHeight(){
        return this.height;
    }

    public int getExitRow(){
        return this.exitRow;
    }

    public int getExitCol(){
        return this.exitCol;
    }

    public Map<Character,Car> getCars(){
        return this.cars;
    }

    public Character[][] getGrid(){
        return this.grid;
    }

    public void displayBoard() {
        System.out.println("Current Board:");
        for (int i = 0; i < this.height; i++) {
            StringBuilder row = new StringBuilder();
            for (int j = 0; j < this.width; j++) {
                Character cell = this.grid[i][j];
                row.append(cell).append(' ');
            }
            System.out.println(row.toString().trim());
        }
        System.out.println();
    }

    public boolean isSolve(){
        if (!cars.containsKey('P')){
            System.out.println("Loh kok mobil utamanya ilang");
            return false;
        }

        Car mainCar = cars.get('P');

        int startRow = mainCar.getStartRow();
        int startCol = mainCar.getStartCol();
        
        if (mainCar.getOrientation().equals("horizontal")){

            if (startCol < this.exitCol){
                for (int i = mainCar.getLength() + startCol; i < this.width; i++){
                    if (!isSpaceEmpty(startRow, i)){
                        return false;
                    }
                }
            }else{
                for (int i = startCol - 1; i >= 0; i--){
                    if (!isSpaceEmpty(startRow, i)){
                        return false;
                    }
                }             
            }
        }else{
            if (startRow < this.exitRow){
                for (int i = mainCar.getLength() + startRow; i < this.height; i++){
                    if (!isSpaceEmpty(i, startCol)){
                        return false;
                    }
                }
            }else{
                for (int i = startRow - 1; i >= 0; i--){
                    if (!isSpaceEmpty(i, startCol)){
                        return false;
                    }
                }             
            }        
        }
        return true;
    }

    public HashMap<Character, Pair<Integer,Integer>> getBlockingCar(){

        HashMap<Character, Pair<Integer,Integer>> result = new HashMap<>();

        Car mainCar = getCarById('P');

        int mainRow = mainCar.getStartRow();
        int mainCol = mainCar.getStartCol();
        int mainLength = mainCar.getLength();


        if (mainCar.getOrientation().equals("horizontal")){

            if (mainCol < getExitCol()){
                for (int i = mainLength + mainCol; i < getWidth(); i++){
                    if (!isSpaceEmpty(mainRow, i)){
                        if (!result.containsKey(grid[mainRow][i])){
                            result.put(grid[mainRow][i],new Pair<>(mainRow, i));
                        } 
                    }
                }
            }else{
                for (int i = mainCol - 1; i >= 0; i--){
                    if (!isSpaceEmpty(mainRow, i)){
                        if (!result.containsKey(grid[mainRow][i])){
                            result.put(grid[mainRow][i],new Pair<>(mainRow, i));
                        } 
                    }
                }             
            }
        }else{
            if (mainRow < getExitRow()){
                for (int i = mainLength + mainRow; i < getHeight(); i++){
                    if (!isSpaceEmpty(i, mainCol)){
                        if (!result.containsKey(grid[i][mainCol])){
                            result.put(grid[i][mainCol],new Pair<>(i, mainCol));
                        } 
                    }
                }
            }else{
                for (int i = mainRow - 1; i >= 0; i--){
                    if (!isSpaceEmpty(i, mainCol)){
                        if (!result.containsKey(grid[i][mainCol])){
                            result.put(grid[i][mainCol],new Pair<>(i, mainCol));
                        } 
                    }
                }             
            }        
        }
        return result;
    }
}