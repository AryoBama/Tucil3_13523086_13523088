package com.project.backend.models;


import java.util.Arrays;

// Kelas yang berisikan kondisi papan, seperti Siapa mobil yang bergerak, bergerak ke arah mana, dll
public class BoardState {

    private Character[][] grid;
    private int step;
    private Car car;
    private String directions;
    
    public BoardState(Board board, int step, Character carId){
        this.grid = board.getGrid();
        this.step = step;
        this.car = board.getCarById(carId);
        if (this.car == null) return;
        if (this.car.getOrientation().equals("horizontal")){
            if (step > 0){
                directions = "right";
            }else{
                directions = "left";
            }
        }else{
            if (step > 0){
                directions = "down";
            }else{
                directions = "up";
            }
        }
    }

    public void displayState(){
    
        if (this.car == null){
            System.out.println("Permainan dimulai");
        }
        else if (this.car.getOrientation().equals("horizontal")){
            if (step > 0){
                directions = "right";
            }else{
                directions = "left";
            }
        }else{
            if (step > 0){
                directions = "down";
            }else{
                directions = "up";
            }
        }
        if(this.car != null){

            System.out.println("Mobil " + this.car.getId()+ " bergerak ke " + directions + " sejauh " + this.step);
        }

        System.out.println("Current Board:");
        for (int i = 0; i < this.grid.length; i++) {
            StringBuilder row = new StringBuilder();
            for (int j = 0; j < this.grid[0].length; j++) {
                Character cell = this.grid[i][j];
                row.append(cell).append(' ');
            }
            System.out.println(row.toString().trim());
        }
        System.out.println();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BoardState)) return false;
        BoardState other = (BoardState) o;
        return Arrays.deepEquals(this.grid, other.grid);
    }

    @Override
    public int hashCode() {
        return Arrays.deepHashCode(this.grid);
    }

    public Character[][] getGrid(){
        return this.grid;
    }

    public int getStep(){
        return this.step;
    }

    public Car getCar(){
        return this.car;
    }

    public String getDirections(){
        return this.directions;
    }

}
