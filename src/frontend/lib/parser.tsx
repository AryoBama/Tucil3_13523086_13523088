export function parseInputFile(input: string): any {
  const lines = input.trim().split("\n")

  // Parse first line for dimensions and number of pieces
  let [A, B] = lines[0].split(" ").map(Number)
  let N = Number(lines[1])
    
  if (isNaN(A) || isNaN(B) || isNaN(N)) {
    throw new Error("Invalid dimensions or number of pieces")
  }


    const exitOnHorizontal = lines
  .slice(2, 2 + A)
  .some(line => line.trimEnd().length === B + 1);


    const exitOnVertical = !exitOnHorizontal;

    if(exitOnVertical) {
        A++;
    }
    else{
        B++;
    }

    const boardLines = lines.slice(2, 2 + A + (exitOnVertical ? 1 : 0)).map(l => l.trimEnd());

    if (exitOnHorizontal) {
        let foundExit = false;
        let countPossibleExit = 0;
        for (const line of boardLines) {
            if(line.length == B){
                countPossibleExit ++;
            }
        }
        if(countPossibleExit != 1 && countPossibleExit != A){
            throw new Error(`Wrong formatting`);
        }

    } else if (exitOnVertical) {
        if (boardLines.length !== A) {
            throw new Error(`Expected ${A} rows for vertical exit, got ${boardLines.length}`);
        }
        let top = 0;
        let bot = 0;
        // Validate all rows except the extra one have length B
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
            if (i < A && line.length !== B && line.length !== 1) {
                throw new Error(`Expected row length ${B - 1} for row ${i + 1}, got ${line.length}`);
            }
            if (i === A && line.length !== B) {
                throw new Error(`Expected last row length ${B - 1} for exit row, got ${line.length}`);
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

  for (let i = 0; i < A; i++) {
    for (let j = 0; j < B; j++) {
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
    const isOnEdge = exitRow === 0 || exitRow === A - 1 || exitCol === 0 || exitCol === B - 1

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

  for (let i = 0; i < A; i++) {
    for (let j = 0; j < B; j++) {
      const cell = initialBoard[i][j]
      if (cell !== "." && cell !== "K") {
        if (!pieces.has(cell)) {
          pieces.set(cell, [])
        }
        pieces.get(cell)?.push([i, j])
      }
    }
  }

  // Validate number of pieces
  if (pieces.size - 1 !== N) {
    // -1 for primary piece
    console.warn(`Warning: Expected ${N} pieces (excluding primary piece), found ${pieces.size - 1}`)
  }

  return {
    dimensions: [A, B],
    numPieces: N,
    initialBoard,
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
  }
}

export async function sendParsedData(input: string) {
  try {
    const parsedData = await parseInputFile(input);

    const url = 'https://your-server-endpoint.com/api/data';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'width': parsedData.dimensions[0] ,
        'height': parsedData.dimensions[1],
        'grid': parsedData.pieces,
        'exitRow': parsedData.exitPosition[0],
        'exitCol': parsedData.exitPosition[1]
      },
      body: JSON.stringify(parsedData),
    });

    // Check if the request was successful
    if (response.ok) {
      const responseData = await response.json();
      console.log('Data posted successfully:', responseData);
    } else {
      console.error('Failed to send data:', response.statusText);
    }
  } catch (error) {
    console.error('Error while sending data:', error);
  }
}
