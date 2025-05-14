import { Car } from "./Car.js";

export class Board {
    constructor(width, height, exitRow, exitCol) {
        this.width = width;
        this.height = height;
        this.cars = [];
        this.exitRow = exitRow;
        this.exitCol = exitCol;
        this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(null));
    }

    addCar(car, x, y) {
        if (car.orientation === 'vertical') {
            for (let i = x; i < this.width; i++) {
                if (this.grid[i][y] != null) {
                    console.log("Tertabrak");
                    return;
                }
            }
        } else {
            for (let i = y; i < this.height; i++) {
                if (this.grid[x][i] != null) {
                    console.log("Tertabrak");
                    return;
                }
            }
        }

        car.startRow = x;
        car.startCol = y;
        car.occupiedCells = car.calculateOccupiedCells();
        this.cars.push(car);
        car.occupiedCells.forEach(([row, col]) => {
            this.grid[row][col] = car.id;
        });
    }

    removeCar(carId) {
        const car = this.getCarById(carId);
        if (!car){
            return false
        }
        this.cars = this.cars.filter(c => c.id !== carId);
        car.occupiedCells.forEach(([row, col]) => {
            this.grid[row][col] = null;
        });
        return true
    }

    isValidMove(carId, steps) {
        const car = this.getCarById(carId);
        if (!car) return false;
        
        const newCells = [];
        
        if (car.orientation === 'horizontal') {
            const newCol = car.startCol + steps;
            
            if (newCol < 0 || newCol + car.length > this.width) {
                return false;
            }
            
            if (steps > 0) {
                for (let i = 0; i < steps; i++) {
                    const checkCol = car.startCol + car.length + i;
                    if (checkCol < this.width && !this.isSpaceEmpty(car.startRow, checkCol)) {
                        return false;
                    }
                }
            } else if (steps < 0) {
                for (let i = 0; i > steps; i--) {
                    const checkCol = car.startCol + i - 1;
                    if (checkCol >= 0 && !this.isSpaceEmpty(car.startRow, checkCol)) {
                        return false;
                    }
                }
            } else {
                return false;
            }
            
        } else {
            const newRow = car.startRow + steps;
            
            if (newRow < 0 || newRow + car.length > this.height) {
                return false;
            }
            
            if (steps > 0) {
                for (let i = 0; i < steps; i++) {
                    const checkRow = car.startRow + car.length + i;
                    if (checkRow < this.height && !this.isSpaceEmpty(checkRow, car.startCol)) {
                        return false;
                    }
                }
            } else if (steps < 0) {
                for (let i = 0; i > steps; i--) {
                    const checkRow = car.startRow + i - 1;
                    if (checkRow >= 0 && !this.isSpaceEmpty(checkRow, car.startCol)) {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        
        return true;
    }

    move(carId, steps) {
        if (!this.isValidMove(carId, steps)) {
            return false;
        }
        
        const car = this.getCarById(carId);
        
        car.occupiedCells.forEach(([row, col]) => {
            this.grid[row][col] = null;
        });
        
        if (car.orientation === 'horizontal') {
            car.startCol += steps;
        } else {
            car.startRow += steps;
        }
        
        car.updateOccupiedCells();
        
        car.occupiedCells.forEach(([row, col]) => {
            this.grid[row][col] = car.id;
        });
        
        return true;
    }

    isSpaceEmpty(row, col) {
        return this.grid[row][col] === null;
    }

    getCarById(id) {
        return this.cars.find(c => c.id === id);
    }

    getVehicleAt(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[y][x];
        }
        return null;
    }

    clone() {
        const newBoard = new Board(this.width, this.height, this.exitRow, this.exitCol);
        
        for (const car of this.cars) {
            newBoard.addCar(car.clone(), car.startRow, car.startCol);
        }

        return newBoard;
    }

    displayBoard() {
        console.log("Current Board:");
        for (let i = 0; i < this.height; i++) {
            let row = '';
            for (let j = 0; j < this.width; j++) {
                row += this.grid[i][j] === null ? '.' : this.grid[i][j];
                row += ' ';
            }
            console.log(row.trim());
        }
        console.log("\n");
    }
}