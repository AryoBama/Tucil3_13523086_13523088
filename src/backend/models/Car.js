export class Car {
    constructor(id, startRow, startCol, length, orientation) {
        this.id = id;
        this.startRow = startRow;
        this.startCol = startCol;
        this.length = length;
        this.orientation = orientation;
        this.occupiedCells = this.calculateOccupiedCells();
        this.isMainCar =  id === 'P'; 
    }

    calculateOccupiedCells() {
        let cells = [];
        for (let i = 0; i < this.length; i++) {
            if (this.orientation === 'horizontal') {
            cells.push([this.startRow, this.startCol + i]);
            } else if (this.orientation === 'vertical') {
            cells.push([this.startRow + i, this.startCol]);
            }
        }
        return cells;
    }

    move(steps) {
        if (this.orientation === 'horizontal') {
        this.x += steps;
        } else {
        this.y += steps;
        }
    }

    updateOccupiedCells() {
        this.occupiedCells = [];
        
        if (this.orientation === 'horizontal') {
            // Untuk orientasi horizontal, row tetap sama, column bertambah
            for (let i = 0; i < this.length; i++) {
                this.occupiedCells.push([this.startRow, this.startCol + i]);
            }
        } else { // 'vertical'
            // Untuk orientasi vertikal, column tetap sama, row bertambah
            for (let i = 0; i < this.length; i++) {
                this.occupiedCells.push([this.startRow + i, this.startCol]);
            }
        }
    }

    clone() {
        return new Car(this.id, this.x, this.y, this.length, this.orientation);
    }
}
