import { cloneDeep } from "./utils"

export class PuzzleSolver {
  private puzzle: any
  private algorithm: string
  private heuristic: string
  private nodesVisited = 0

  constructor(puzzle: any, algorithm = "astar", heuristic = "manhattan") {
    this.puzzle = puzzle
    this.algorithm = algorithm
    this.heuristic = heuristic
  }

  solve() {
    this.nodesVisited = 0

    switch (this.algorithm) {
      case "astar":
        return this.aStarSearch()
      case "bfs":
        return this.breadthFirstSearch()
      case "greedy":
        return this.greedyBestFirstSearch()
      default:
        throw new Error(`Unknown algorithm: ${this.algorithm}`)
    }
  }

  getNodesVisited() {
    return this.nodesVisited
  }

  private aStarSearch() {
    const [rows, cols] = this.puzzle.dimensions
    const initialState = {
      board: cloneDeep(this.puzzle.initialBoard),
      pieces: this.mapPiecesPositions(this.puzzle.initialBoard),
      g: 0,
      parent: null,
      move: null as { piece: string; direction: string } | null,
    }

    // Priority queue for A*
    const openSet: any[] = [initialState]
    const closedSet = new Set<string>()

    while (openSet.length > 0) {
      // Sort by f = g + h
      openSet.sort((a, b) => {
        const fA = a.g + this.calculateHeuristic(a)
        const fB = b.g + this.calculateHeuristic(b)
        return fA - fB
      })

      const current = openSet.shift()!
      this.nodesVisited++

      // Check if goal reached
      if (this.isGoalState(current)) {
        return this.reconstructPath(current)
      }

      const stateKey = this.getStateKey(current.board)
      if (closedSet.has(stateKey)) {
        continue
      }

      closedSet.add(stateKey)

      // Generate possible moves
      const possibleMoves = this.generatePossibleMoves(current)

      for (const move of possibleMoves) {
        const newStateKey = this.getStateKey(move.board)

        if (closedSet.has(newStateKey)) {
          continue
        }

        // Set cost and parent
        move.g = current.g + 1
        move.parent = current

        // Check if already in open set with better cost
        const existingIndex = openSet.findIndex((state) => this.getStateKey(state.board) === newStateKey)

        if (existingIndex !== -1 && openSet[existingIndex].g <= move.g) {
          continue
        }

        if (existingIndex !== -1) {
          openSet.splice(existingIndex, 1)
        }

        openSet.push(move)
      }
    }

    return null // No solution found
  }

  private breadthFirstSearch() {
    const initialState = {
      board: cloneDeep(this.puzzle.initialBoard),
      pieces: this.mapPiecesPositions(this.puzzle.initialBoard),
      parent: null,
      move: null,
    }

    const queue: any[] = [initialState]
    const visited = new Set<string>()
    visited.add(this.getStateKey(initialState.board))

    while (queue.length > 0) {
      const current = queue.shift()!
      this.nodesVisited++

      // Check if goal reached
      if (this.isGoalState(current)) {
        return this.reconstructPath(current)
      }

      // Generate possible moves
      const possibleMoves = this.generatePossibleMoves(current)

      for (const move of possibleMoves) {
        const stateKey = this.getStateKey(move.board)

        if (!visited.has(stateKey)) {
          visited.add(stateKey)
          move.parent = current
          queue.push(move)
        }
      }
    }

    return null // No solution found
  }

  private greedyBestFirstSearch() {
    const initialState = {
      board: cloneDeep(this.puzzle.initialBoard),
      pieces: this.mapPiecesPositions(this.puzzle.initialBoard),
      parent: null,
      move: null,
    }

    const openSet: any[] = [initialState]
    const closedSet = new Set<string>()

    while (openSet.length > 0) {
      // Sort by heuristic only (greedy)
      openSet.sort((a, b) => {
        const hA = this.calculateHeuristic(a)
        const hB = this.calculateHeuristic(b)
        return hA - hB
      })

      const current = openSet.shift()!
      this.nodesVisited++

      // Check if goal reached
      if (this.isGoalState(current)) {
        return this.reconstructPath(current)
      }

      const stateKey = this.getStateKey(current.board)
      if (closedSet.has(stateKey)) {
        continue
      }

      closedSet.add(stateKey)

      // Generate possible moves
      const possibleMoves = this.generatePossibleMoves(current)

      for (const move of possibleMoves) {
        const newStateKey = this.getStateKey(move.board)

        if (closedSet.has(newStateKey)) {
          continue
        }

        move.parent = current
        openSet.push(move)
      }
    }

    return null // No solution found
  }

  private calculateHeuristic(state: any) {
    const primaryPiecePositions = state.pieces.get("P")
    const [exitRow, exitCol] = this.puzzle.exit

    if (!primaryPiecePositions || primaryPiecePositions.length === 0) {
      return Number.POSITIVE_INFINITY
    }

    // Get the position of the primary piece that's closest to the exit
    let minDistance = Number.POSITIVE_INFINITY

    for (const [row, col] of primaryPiecePositions) {
      let distance

      switch (this.heuristic) {
        case "manhattan":
          distance = Math.abs(row - exitRow) + Math.abs(col - exitCol)
          break
        case "euclidean":
          distance = Math.sqrt(Math.pow(row - exitRow, 2) + Math.pow(col - exitCol, 2))
          break
        case "custom":
          // Custom heuristic that considers blocking pieces
          distance = this.customHeuristic(state, [row, col], [exitRow, exitCol])
          break
        default:
          distance = Math.abs(row - exitRow) + Math.abs(col - exitCol)
      }

      minDistance = Math.min(minDistance, distance)
    }

    return minDistance
  }

  private customHeuristic(state: any, [row, col]: [number, number], [exitRow, exitCol]: [number, number]) {
    // Base Manhattan distance
    let distance = Math.abs(row - exitRow) + Math.abs(col - exitCol)

    // Add penalty for each blocking piece in the path
    const isHorizontal = this.puzzle.primaryPiece.isHorizontal

    if (isHorizontal) {
      // Check horizontal path to exit
      const startCol = Math.min(col, exitCol)
      const endCol = Math.max(col, exitCol)

      for (let c = startCol; c <= endCol; c++) {
        if (state.board[row][c] !== "P" && state.board[row][c] !== "." && state.board[row][c] !== "K") {
          distance += 2 // Penalty for blocking piece
        }
      }
    } else {
      // Check vertical path to exit
      const startRow = Math.min(row, exitRow)
      const endRow = Math.max(row, exitRow)

      for (let r = startRow; r <= endRow; r++) {
        if (state.board[r][col] !== "P" && state.board[r][col] !== "." && state.board[r][col] !== "K") {
          distance += 2 // Penalty for blocking piece
        }
      }
    }

    return distance
  }

  private isGoalState(state: any) {
    const primaryPiecePositions = state.pieces.get("P")
    const [exitRow, exitCol] = this.puzzle.exit

    if (!primaryPiecePositions) return false

    // Check if any part of the primary piece is at the exit
    for (const [row, col] of primaryPiecePositions) {
      // For horizontal primary piece, check if it can reach the exit
      if (this.puzzle.primaryPiece.isHorizontal) {
        if (
          row === exitRow &&
          ((exitCol === 0 && col === 1) || // Exit on left edge
            (exitCol === this.puzzle.dimensions[1] - 1 && col === this.puzzle.dimensions[1] - 2)) // Exit on right edge
        ) {
          return true
        }
      }
      // For vertical primary piece, check if it can reach the exit
      else {
        if (
          col === exitCol &&
          ((exitRow === 0 && row === 1) || // Exit on top edge
            (exitRow === this.puzzle.dimensions[0] - 1 && row === this.puzzle.dimensions[0] - 2)) // Exit on bottom edge
        ) {
          return true
        }
      }

      // Direct adjacency to exit
      if ((row === exitRow && Math.abs(col - exitCol) === 1) || (col === exitCol && Math.abs(row - exitRow) === 1)) {
        return true
      }
    }

    return false
  }

  private generatePossibleMoves(state: any) {
    const possibleMoves: any[] = []
    const [rows, cols] = this.puzzle.dimensions

    // For each piece, try to move in all four directions
    for (const [piece, positions] of state.pieces.entries()) {
      if (positions.length === 0) continue

      // Determine if piece is horizontal or vertical
      const isHorizontal = positions.length > 1 && positions[0][0] === positions[1][0]

      // Try moving in each direction
      const directions = [
        { name: "up", rowDelta: -1, colDelta: 0 },
        { name: "down", rowDelta: 1, colDelta: 0 },
        { name: "left", rowDelta: 0, colDelta: -1 },
        { name: "right", rowDelta: 0, colDelta: 1 },
      ]

      for (const direction of directions) {
        // Skip invalid directions based on piece orientation
        if (
          (isHorizontal && (direction.name === "up" || direction.name === "down")) ||
          (!isHorizontal && (direction.name === "left" || direction.name === "right"))
        ) {
          continue
        }

        // Check if move is valid
        if (this.isValidMove(state, piece, positions, direction)) {
          // Create new state after move
          const newState = this.applyMove(state, piece, positions, direction)
          newState.move = {
            piece,
            direction: direction.name,
          }
          possibleMoves.push(newState)
        }
      }
    }

    return possibleMoves
  }

  private isValidMove(
    state: any,
    piece: string,
    positions: [number, number][],
    direction: { name: string; rowDelta: number; colDelta: number },
  ) {
    const [rows, cols] = this.puzzle.dimensions
    const { rowDelta, colDelta } = direction

    // Check if any position would go out of bounds or hit another piece
    for (const [row, col] of positions) {
      const newRow = row + rowDelta
      const newCol = col + colDelta

      // Check bounds
      if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
        return false
      }

      // Check if the new position is occupied by another piece
      // (except for the exit, which can be moved into)
      if (
        state.board[newRow][newCol] !== "." &&
        state.board[newRow][newCol] !== piece &&
        state.board[newRow][newCol] !== "K"
      ) {
        return false
      }
    }

    // For the piece to move, we also need to check the "leading edge"
    // i.e., the cells that the piece will move into
    let leadingEdge: [number, number][] = []

    if (direction.name === "up") {
      // Get the top-most positions
      const minRow = Math.min(...positions.map(([r, c]) => r))
      leadingEdge = positions.filter(([r, c]) => r === minRow).map(([r, c]) => [r - 1, c])
    } else if (direction.name === "down") {
      // Get the bottom-most positions
      const maxRow = Math.max(...positions.map(([r, c]) => r))
      leadingEdge = positions.filter(([r, c]) => r === maxRow).map(([r, c]) => [r + 1, c])
    } else if (direction.name === "left") {
      // Get the left-most positions
      const minCol = Math.min(...positions.map(([r, c]) => c))
      leadingEdge = positions.filter(([r, c]) => c === minCol).map(([r, c]) => [r, c - 1])
    } else if (direction.name === "right") {
      // Get the right-most positions
      const maxCol = Math.max(...positions.map(([r, c]) => c))
      leadingEdge = positions.filter(([r, c]) => c === maxCol).map(([r, c]) => [r, c + 1])
    }

    // Check if all leading edge cells are empty or exit
    for (const [r, c] of leadingEdge) {
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return false
      }

      if (state.board[r][c] !== "." && state.board[r][c] !== "K") {
        return false
      }
    }

    return true
  }

  private applyMove(
    state: any,
    piece: string,
    positions: [number, number][],
    direction: { name: string; rowDelta: number; colDelta: number },
  ) {
    const newBoard = cloneDeep(state.board)
    const { rowDelta, colDelta } = direction

    // Clear current positions
    for (const [row, col] of positions) {
      newBoard[row][col] = "."
    }

    // Set new positions
    const newPositions: [number, number][] = positions.map(([row, col]) => [row + rowDelta, col + colDelta])

    for (const [row, col] of newPositions) {
      // Don't overwrite the exit
      if (newBoard[row][col] !== "K") {
        newBoard[row][col] = piece
      }
    }

    // Create new state
    const newState = {
      board: newBoard,
      pieces: this.mapPiecesPositions(newBoard),
      parent: null,
      move: null,
    }

    return newState
  }

  private mapPiecesPositions(board: string[][]) {
    const pieces = new Map<string, [number, number][]>()

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = board[i][j]
        if (cell !== "." && cell !== "K") {
          if (!pieces.has(cell)) {
            pieces.set(cell, [])
          }
          pieces.get(cell)?.push([i, j])
        }
      }
    }

    return pieces
  }

  private getStateKey(board: string[][]) {
    return board.map((row) => row.join("")).join("|")
  }

  private reconstructPath(finalState: any) {
    const steps: any[] = []
    let current = finalState

    while (current.parent !== null) {
      steps.unshift({
        board: current.board,
        piece: current.move.piece,
        direction: current.move.direction,
      })
      current = current.parent
    }

    return {
      steps,
      initialBoard: this.puzzle.initialBoard,
    }
  }
}
