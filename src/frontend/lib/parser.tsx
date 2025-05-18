export function parseInputFile(input: string): any {
  const lines = input.trim().split("\n")

  // Parse first line for dimensions and number of pieces
  let [row, col] = lines[0].split(" ").map(Number)
  let N = Number(lines[1])
    
  if (isNaN(row) || isNaN(col) || isNaN(N)) {
    throw new Error("Invalid dimensions or number of pieces")
  }


    const exitOnHorizontal = lines
  .slice(2, 2 + row)
  .some(line => line.trimEnd().length === col + 1);


    const exitOnVertical = !exitOnHorizontal;

    if(exitOnVertical) {
        row++;
    }
    else{
        col++;
    }

    const boardLines = lines.slice(2, 2 + row + (exitOnVertical ? 1 : 0)).map(l => l.trimEnd());

    if (exitOnHorizontal) {
        let foundExit = false;
        let countPossibleExit = 0;
        for (const line of boardLines) {
            if(line.length == col){
                countPossibleExit ++;
            }
        }
        if(countPossibleExit != 1 && countPossibleExit != row){
            throw new Error(`Wrong formatting`);
        }

    } else if (exitOnVertical) {
        if (boardLines.length !== row) {
            throw new Error(`Expected ${row} rows for vertical exit, got ${boardLines.length}`);
        }
        let top = 0;
        let bot = 0;
        // Validate all rows except the extra one have length col
        for(let i = 0; i < boardLines[0].length; i++){
            if(boardLines[0][i] === 'K'){
                top = 1;
            }
        }
        if(!top){
            bot = 1;
        }

        for (let i = 0 + top; i < boardLines.length - bot; i++) {
            const line = boardLines[i];
            if (i < row && line.length !== col && line.length !== 1) {
                throw new Error(`Expected row length ${col - 1} for row ${i + 1}, got ${line.length}`);
            }
            if (i === row && line.length !== col) {
                throw new Error(`Expected last row length ${col - 1} for exit row, got ${line.length}`);
            }
        }
        // Optionally, count or validate exit position in last row
    }


  // Convert board to 2D array
  const initialBoard = boardLines.map((line) => line.split(""))


  // Find primary piece and exit
  let primaryPieceFound = false
  let exitFound = false
  const primaryPiecePositions: [number, number][] = []
  let exitPosition: [number, number] | null = null

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (initialBoard[i][j] === "P") {
        primaryPieceFound = true
        primaryPiecePositions.push([i, j])
      } else if (initialBoard[i][j] === "K") {
        exitFound = true
        exitPosition = [i, j]
      }
    }
  }

  if (!primaryPieceFound) {
    throw new Error("Primary piece (P) not found in the board")
  }

  if (!exitFound) {
    throw new Error("Exit (K) not found in the board")
  }

  // Determine primary piece orientation (horizontal or vertical)
  const isHorizontal = primaryPiecePositions.length > 1 && primaryPiecePositions[0][0] === primaryPiecePositions[1][0]

  // Validate exit position (must be on the edge and aligned with primary piece)
  if (exitPosition) {
    const [exitRow, exitCol] = exitPosition
    const isOnEdge = exitRow === 0 || exitRow === row - 1 || exitCol === 0 || exitCol === col - 1

    if (!isOnEdge) {
      throw new Error("Exit must be on the edge of the board")
    }

    // Check alignment with primary piece orientation
    if (isHorizontal && exitRow !== primaryPiecePositions[0][0]) {
      throw new Error("Exit must be aligned with the primary piece's orientation")
    } else if (!isHorizontal && exitCol !== primaryPiecePositions[0][1]) {
      throw new Error("Exit must be aligned with the primary piece's orientation")
    }
  }

  // Find all pieces on the board
  const pieces = new Map<string, [number, number][]>()

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const cell = initialBoard[i][j]
      if (cell !== "." && cell !== "K" && cell !== " " && cell) {
        if (!pieces.has(cell)) {
          pieces.set(cell, [])
        }
        
        if (exitPosition && exitPosition[0] === 0) {
          if (i - 1 >= 0) {
            pieces.get(cell)?.push([i - 1, j]);
          }
        } else if (exitPosition && exitPosition[1] === 0) {
          if (j - 1 >= 0) {
            pieces.get(cell)?.push([i, j - 1]);
          }
        } else {
          pieces.get(cell)?.push([i, j]);
        }
      }
    }
  }
  console.log(pieces)
 
  if (pieces.size - 1 !== N) {
    console.warn(`Warning: Expected ${N} pieces (excluding primary piece), found ${pieces.size - 1}`)
  }

  
  let originA = row;
  let originB = col;
  
  if(exitOnVertical){
    row--;
  } else{
    col--
  }
  
  let maxColLen = initialBoard[0].length
  for (let i = 0; i < row; i++) {
    if(initialBoard[i].length > maxColLen){
      maxColLen = initialBoard[i].length
    }
  }
  console.log(maxColLen)
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (initialBoard[i][j] === " ") {
          initialBoard[i][j] = "."
      }
    }
    while(initialBoard[i].length < maxColLen){
      initialBoard[i].push(".")
    }
  }
  
  return {
    dimensions: [originA, originB],
    numPieces: N,
    initialBoard,
    exitOnVertical: exitOnVertical,
    primaryPiece: {
      positions: primaryPiecePositions,
      isHorizontal,
    },
    exit: exitPosition,
    pieces: Array.from(pieces.entries()).map(([symbol, positions]) => ({
      symbol,
      positions,
      isHorizontal: positions.length > 1 && positions[0][0] === positions[1][0],
    })),
    grid: createGridFromPieces(
      Array.from(pieces.entries()).map(([symbol, positions]) => ({
        symbol,
        positions,
        isHorizontal: positions.length > 1 && positions[0][0] === positions[1][0],
      })),
      row,
      col
    )
  }
}

function createGridFromPieces(pieces: any, rows: number, cols: number):any {
  const grid = Array.from({ length: rows }, () => Array(cols).fill('.'));

  for (const piece of pieces) {
    if (!piece.symbol) continue;

    for (const [row, col] of piece.positions) {
      grid[row][col] = piece.symbol;
    }
  }

  return grid;
}


export async function sendParsedData(input: string) {
  try {
    const parsedData = await parseInputFile(input);
    let sendedCol =  parsedData.dimensions[0];
    let sendedRow =  parsedData.dimensions[1];
    let sendedExitRow = parsedData.exit[0]
    let sendedExitCol = parsedData.exit[1]

    if(parsedData.exitOnVertical){
      sendedCol = parsedData.dimensions[0] - 1;
    }else{
      sendedRow = parsedData.dimensions[1] - 1;
    }
     if (parsedData.exit[0] === 0) {
       sendedExitRow =  parsedData.exit[0] - 1
      }
      if (parsedData.exit[1] === 0) {
        sendedExitCol = parsedData.exit[1] - 1
      }
      

    console.log(parsedData.grid)
    console.log(parsedData.initialBoard)
    console.log(sendedExitCol)
    const url = 'http://localhost:8080/api/solve/UCS';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        width: sendedCol,
        height: sendedRow,
        grid: parsedData.grid,
        exitRow: sendedExitRow,
        exitCol:sendedExitCol
      }),
    });
    
    if (response.ok) {
    const responseData = await response.json();
    console.log(responseData.steps)
    
    const initialRows = parsedData.dimensions[0];
    const initialCols = parsedData.dimensions[1];
    const exitRow = parsedData.exit[0];
    const exitCol = parsedData.exit[1];

  
    if (responseData.solution && Array.isArray(responseData.solution.steps)) {
      responseData.solution.steps = responseData.solution.steps.map((step: any) => ({
        ...step,
        board: padBoardWithExit(step.board, initialRows, initialCols, exitRow, exitCol)
      }));
    } else if (Array.isArray(responseData.steps)) {
      responseData.steps = responseData.steps.map((step: any) => ({
        ...step,
        board: padBoardWithExit(step.board, initialRows, initialCols, exitRow, exitCol)
      }));
    }
        return responseData; 
      } else {
        console.error('Failed to send data:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error while sending data:', error);
      return null;
    }
  }

function padBoardWithExit(
  board: string[][],
  rows: number,
  cols: number,
  exitRow: number,
  exitCol: number
) {
  let padded: string[][];
  if (exitRow === 0) {
    padded = [
      Array.from({ length: cols }, (_, c) => (c === exitCol ? "K" : ".")),
      ...Array.from({ length: rows - 1 }, (_, r) =>
        Array.from({ length: cols }, (_, c) => board[r]?.[c] ?? ".")
      ),
    ];
  }
  else if (exitRow === rows - 1) {
    padded = [
      ...Array.from({ length: rows - 1 }, (_, r) =>
        Array.from({ length: cols }, (_, c) => board[r]?.[c] ?? ".")
      ),
      Array.from({ length: cols }, (_, c) => (c === exitCol ? "K" : ".")),
    ];
  }
  else if (exitCol === 0) {
    padded = Array.from({ length: rows }, (_, r) => [
      r === exitRow ? "K" : ".",
      ...Array.from({ length: cols - 1 }, (_, c) => board[r]?.[c] ?? "."),
    ]);
  }
  else if (exitCol === cols - 1) {
    padded = Array.from({ length: rows }, (_, r) => [
      ...Array.from({ length: cols - 1 }, (_, c) => board[r]?.[c] ?? "."),
      r === exitRow ? "K" : ".",
    ]);
  }
  else {
    padded = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => board[r]?.[c] ?? ".")
    );
    if (
      exitRow >= 0 &&
      exitRow < rows &&
      exitCol >= 0 &&
      exitCol < cols
    ) {
      padded[exitRow][exitCol] = "K";
    }
  }

  return padded;
}