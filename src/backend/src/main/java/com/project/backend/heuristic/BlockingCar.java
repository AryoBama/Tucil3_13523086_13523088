package com.project.backend.heuristic;

import com.project.backend.models.*;

public class BlockingCar implements CountHeuristic {

    @Override
    public int getValue(Board b){

        int countCar = 0; // For counting blocking car

        Car mainCar = b.getCarById('P');

        int mainRow = mainCar.getStartRow();
        int mainCol = mainCar.getStartCol();
        int mainLength = mainCar.getLength();


        if (mainCar.getOrientation().equals("horizontal")){

            if (mainCol < b.getExitCol()){
                for (int i = mainLength + mainCol; i < b.getWidth(); i++){
                    if (!b.isSpaceEmpty(mainRow, i)){
                        countCar++;
                    }
                }
            }else{
                for (int i = mainCol - 1; i >= 0; i--){
                    if (!b.isSpaceEmpty(mainRow, i)){
                        countCar++;
                    }
                }             
            }
        }else{
            if (mainRow < b.getExitRow()){
                for (int i = mainLength + mainRow; i < b.getHeight(); i++){
                    if (!b.isSpaceEmpty(i, mainCol)){
                        countCar++;
                    }
                }
            }else{
                for (int i = mainRow + 1; i >= 0; i--){
                    if (!b.isSpaceEmpty(i, mainCol)){
                        countCar++;
                    }
                }             
            }        
        }
        return countCar;
    }
}
