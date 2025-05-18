package com.project.backend.models;


public class Car{

    private Character id;
    private int startRow;
    private int startCol;
    private int length;
    private String orientation;
    private boolean isMainCar;

    public Car(Character id, int startRow, int startCol, int length, String orientation){

        this.id = id;
        this.startRow = startRow;
        this.startCol = startCol;
        this.length = length;
        this.orientation = orientation;
        this.isMainCar =  id == 'P';

    }

    public Car(Character id, int length, String orientation) {
        this.id = id;
        this.length = length;
        this.orientation = orientation;
        this.startRow = 0;
        this.startCol = 0;
        this.isMainCar = id == 'P';
    }

    public Car(Car other){

        this.id = other.id;
        this.startRow = other.startRow;
        this.startCol = other.startCol;
        this.length = other.length;
        this.orientation = other.orientation;
        this.isMainCar = other.isMainCar;

    }

    public void move(int steps) {

        if (this.orientation.equals("horizontal")) {
            this.startCol += steps;
        } else {
            this.startRow += steps;
        }
    }

    public Character getId() {
        return id;
    }

    public int getStartRow() {
        return startRow;
    }

    public int getStartCol() {
        return startCol;
    }

    public int getLength() {
        return length;
    }

    public String getOrientation() {
        return orientation;
    }

    public boolean isMainCar() {
        return isMainCar;
    }

    // Setters
    public void setId(Character id) {
        this.id = id;
    }

    public void setStartRow(int startRow) {
        this.startRow = startRow;
    }

    public void setStartCol(int startCol) {
        this.startCol = startCol;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public void setOrientation(String orientation) {
        this.orientation = orientation;
    }

    public void setMainCar(boolean mainCar) {
        isMainCar = mainCar;
    }

}