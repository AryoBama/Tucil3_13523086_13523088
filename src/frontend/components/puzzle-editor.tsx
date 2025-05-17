"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const PIECE_COLORS = {
  P: "bg-red-500 text-white",
  K: "bg-green-500 text-white",
  A: "bg-blue-300",
  B: "bg-purple-300",
  C: "bg-pink-300",
  D: "bg-indigo-300",
  E: "bg-teal-300",
  F: "bg-orange-300",
  G: "bg-cyan-300",
  H: "bg-lime-300",
  I: "bg-amber-300",
  J: "bg-yellow-300",
  L: "bg-emerald-300",
  M: "bg-sky-300",
  N: "bg-violet-300",
  O: "bg-fuchsia-300",
  Q: "bg-rose-300",
  R: "bg-blue-200",
  S: "bg-purple-200",
  T: "bg-pink-200",
  U: "bg-indigo-200",
  V: "bg-teal-200",
  W: "bg-orange-200",
  X: "bg-cyan-200",
  Y: "bg-lime-200",
  Z: "bg-amber-300",
}

type PieceType = {
  id: string
  cells: [number, number][]
  isHorizontal: boolean
}

type BoardState = {
  dimensions: [number, number] // Inner dimensions (without border)
  board: string[][] // Full board including border
  pieces: PieceType[]
  primaryPiece: PieceType | null
  exit: [number, number] | null
  selectedCells: [number, number][] // For tracking clicked cells
}

type EditorMode = "place" | "erase" | "primary" | "exit"

export function PuzzleEditor({ onPuzzleCreated }: { onPuzzleCreated: (puzzleText: string) => void }) {
  // Inner dimensions (without border)
  const [innerRows, setInnerRows] = useState(6)
  const [innerCols, setInnerCols] = useState(6)

  // Full dimensions (with border)
  const { fullRows, fullCols } = useMemo(
    () => ({
      fullRows: innerRows + 2,
      fullCols: innerCols + 2,
    }),
    [innerRows, innerCols],
  )

  const [boardState, setBoardState] = useState<BoardState>({
    dimensions: [innerRows, innerCols],
    board: Array(fullRows)
      .fill(null)
      .map(() => Array(fullCols).fill(".")),
    pieces: [],
    primaryPiece: null,
    exit: null,
    selectedCells: [],
  })
  const [currentPiece, setCurrentPiece] = useState<string>("A")
  const [mode, setMode] = useState<EditorMode>("place")
  const [dragStart, setDragStart] = useState<[number, number] | null>(null)
  const [dragEnd, setDragEnd] = useState<[number, number] | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false)

  // Determine exit position and direction
  const exitInfo = useMemo(() => {
    if (!boardState.exit) return null

    const [exitRow, exitCol] = boardState.exit

    let direction = ""
    if (exitRow === 0) direction = "top"
    else if (exitRow === fullRows - 1) direction = "bottom"
    else if (exitCol === 0) direction = "left"
    else if (exitCol === fullCols - 1) direction = "right"

    return { row: exitRow, col: exitCol, direction }
  }, [boardState.exit, fullRows, fullCols])

  // Check if a cell is in the border
  const isBorderCell = (row: number, col: number) => {
    return row === 0 || row === fullRows - 1 || col === 0 || col === fullCols - 1
  }

  // Check if a cell is the exit
  const isExitCell = (row: number, col: number) => {
    return boardState.exit && boardState.exit[0] === row && boardState.exit[1] === col
  }

  // Reset board when dimensions change
  useEffect(() => {
    const newFullRows = innerRows + 2
    const newFullCols = innerCols + 2

    setBoardState((prevState) => ({
      dimensions: [innerRows, innerCols],
      board: Array(newFullRows)
        .fill(null)
        .map(() => Array(newFullCols).fill(".")),
      pieces: [],
      primaryPiece: null,
      exit: null,
      selectedCells: [],
    }))
    setValidationErrors([])
    setValidationSuccess(false)
  }, [innerRows, innerCols])

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (mode === "place") {
      // If it's a border cell, don't allow placing pieces
      if (isBorderCell(row, col)) {
        alert("Cannot place pieces in the border area. Border is reserved for exits only.")
        return
      }

      // If this is the first cell selected
      if (boardState.selectedCells.length === 0) {
        setBoardState((prevState) => ({
          ...prevState,
          selectedCells: [[row, col]],
        }))
        return
      }

      // If this is the second cell selected
      if (boardState.selectedCells.length === 1) {
        const [firstRow, firstCol] = boardState.selectedCells[0]

        // Check if the cells form a straight line
        const isHorizontal = row === firstRow
        const isVertical = col === firstCol

        if (!isHorizontal && !isVertical) {
          alert("Pieces must be either horizontal or vertical")
          setBoardState((prevState) => ({
            ...prevState,
            selectedCells: [],
          }))
          return
        }

        // Place the piece
        placePiece(firstRow, firstCol, row, col, currentPiece)

        // Clear selected cells
        setBoardState((prevState) => ({
          ...prevState,
          selectedCells: [],
        }))
      }
    } else if (mode === "erase") {
      eraseCells(row, col)
    } else if (mode === "primary") {
      placePrimaryPiece(row, col)
    } else if (mode === "exit") {
      // Only allow placing exits in the border
      if (!isBorderCell(row, col)) {
        alert("Exits can only be placed in the border area")
        return
      }
      placeExit(row, col)
    }
  }

  // Handle cell drag
  const handleCellDrag = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    if (mode !== "place") return

    // If either start or end is in the border, don't allow
    if (isBorderCell(startRow, startCol) || isBorderCell(endRow, endCol)) {
      alert("Cannot place pieces in the border area. Border is reserved for exits only.")
      return
    }

    // Check if the cells form a straight line
    const isHorizontal = startRow === endRow
    const isVertical = startCol === endCol

    if (!isHorizontal && !isVertical) {
      alert("Pieces must be either horizontal or vertical")
      return
    }

    // Place the piece
    placePiece(startRow, startCol, endRow, endCol, currentPiece)
  }

  // Place a piece on the board
  const placePiece = (startRow: number, startCol: number, endRow: number, endCol: number, pieceId: string) => {
    // Ensure start is top-left and end is bottom-right
    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minCol = Math.min(startCol, endCol)
    const maxCol = Math.max(startCol, endCol)

    // Check if this is a valid piece (horizontal or vertical)
    const isHorizontal = minRow === maxRow
    const isVertical = minCol === maxCol

    if (!isHorizontal && !isVertical) {
      alert("Pieces must be either horizontal or vertical")
      return
    }

    // Check if cells are available
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (boardState.board[r][c] !== "." && boardState.board[r][c] !== pieceId) {
          alert("Cannot place piece over existing pieces")
          return
        }
      }
    }

    // Create new board state
    const newBoard = [...boardState.board.map((row) => [...row])]
    const cells: [number, number][] = []

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newBoard[r][c] = pieceId
        cells.push([r, c])
      }
    }

    // Update or create piece
    const existingPieceIndex = boardState.pieces.findIndex((p) => p.id === pieceId)
    const newPiece = { id: pieceId, cells, isHorizontal }

    let newPieces
    if (existingPieceIndex >= 0) {
      newPieces = [...boardState.pieces]
      newPieces[existingPieceIndex] = newPiece
    } else {
      newPieces = [...boardState.pieces, newPiece]
    }

    setBoardState((prevState) => ({
      ...prevState,
      board: newBoard,
      pieces: newPieces,
      selectedCells: [],
    }))

    setValidationErrors([])
    setValidationSuccess(false)
  }

  // Erase cells
  const eraseCells = (row: number, col: number) => {
    const cell = boardState.board[row][col]
    if (cell === ".") return

    // If it's the exit, remove it
    if (cell === "K") {
      const newBoard = [...boardState.board.map((row) => [...row])]
      newBoard[row][col] = "."

      setBoardState((prevState) => ({
        ...prevState,
        board: newBoard,
        exit: null,
        selectedCells: [],
      }))
      return
    }

    // Don't allow erasing border cells that aren't exits
    if (isBorderCell(row, col) && cell !== "K") {
      return
    }

    // Find the piece
    const pieceToRemove = boardState.pieces.find((p) => p.id === cell)
    if (!pieceToRemove) return

    // Create new board state
    const newBoard = [...boardState.board.map((row) => [...row])]

    // Clear all cells of this piece
    for (const [r, c] of pieceToRemove.cells) {
      newBoard[r][c] = "."
    }

    // Remove the piece from the pieces list
    const newPieces = boardState.pieces.filter((p) => p.id !== cell)

    // Update primary piece if needed
    let newPrimaryPiece = boardState.primaryPiece
    if (boardState.primaryPiece?.id === cell) {
      newPrimaryPiece = null
    }

    setBoardState((prevState) => ({
      ...prevState,
      board: newBoard,
      pieces: newPieces,
      primaryPiece: newPrimaryPiece,
      selectedCells: [],
    }))

    setValidationErrors([])
    setValidationSuccess(false)
  }

  // Place primary piece
  const placePrimaryPiece = (row: number, col: number) => {
    // Don't allow placing primary piece in border
    if (isBorderCell(row, col)) {
      alert("Cannot place primary piece in the border area")
      return
    }

    const cell = boardState.board[row][col]

    // Can't place primary on empty cell or exit
    if (cell === "." || cell === "K") {
      alert("Cannot set primary piece on an empty cell or exit")
      return
    }

    // Find the piece
    const piece = boardState.pieces.find((p) => p.id === cell)
    if (!piece) return

    // Create new board state
    const newBoard = [...boardState.board.map((row) => [...row])]

    // Clear old primary piece if exists
    if (boardState.primaryPiece) {
      for (const [r, c] of boardState.primaryPiece.cells) {
        newBoard[r][c] = "."
      }
    }

    // Set new primary piece
    for (const [r, c] of piece.cells) {
      newBoard[r][c] = "P"
    }

    // Update pieces list
    const newPieces = boardState.pieces.filter((p) => p.id !== cell && p.id !== "P")

    setBoardState((prevState) => ({
      ...prevState,
      board: newBoard,
      pieces: newPieces,
      primaryPiece: { ...piece, id: "P" },
      selectedCells: [],
    }))

    setValidationErrors([])
    setValidationSuccess(false)
  }

  // Place exit
  const placeExit = (row: number, col: number) => {
    // Exit must be in the border
    if (!isBorderCell(row, col)) {
      alert("Exit must be placed in the border area")
      return
    }

    // Check if there's a primary piece and if the exit aligns with it
    if (boardState.primaryPiece) {
      const { isHorizontal } = boardState.primaryPiece
      const primaryRow = boardState.primaryPiece.cells[0][0]
      const primaryCol = boardState.primaryPiece.cells[0][1]

      if (isHorizontal) {
        // For horizontal primary piece, exit must be in the same row
        // But we need to check if it's in the left or right border
        if (row !== primaryRow || (col !== 0 && col !== fullCols - 1)) {
          alert("Exit must be aligned with the primary piece's orientation (same row, left or right border)")
          return
        }
      } else {
        // For vertical primary piece, exit must be in the same column
        // But we need to check if it's in the top or bottom border
        if (col !== primaryCol || (row !== 0 && row !== fullRows - 1)) {
          alert("Exit must be aligned with the primary piece's orientation (same column, top or bottom border)")
          return
        }
      }
    }

    // Create new board state
    const newBoard = [...boardState.board.map((row) => [...row])]

    // Clear old exit if exists
    if (boardState.exit) {
      newBoard[boardState.exit[0]][boardState.exit[1]] = "."
    }

    // Set new exit
    newBoard[row][col] = "K"

    setBoardState((prevState) => ({
      ...prevState,
      board: newBoard,
      exit: [row, col],
      selectedCells: [],
    }))

    setValidationErrors([])
    setValidationSuccess(false)
  }

  // Validate the puzzle
  const validatePuzzle = () => {
    const errors = []

    // Check if primary piece exists
    if (!boardState.primaryPiece) {
      errors.push("Primary piece (P) is required")
    }

    // Check if exit exists
    if (!boardState.exit) {
      errors.push("Exit (K) is required")
    }

    // Check if exit is in the border
    if (boardState.exit) {
      const [exitRow, exitCol] = boardState.exit
      const isInBorder = isBorderCell(exitRow, exitCol)

      if (!isInBorder) {
        errors.push("Exit must be in the border area")
      }
    }

    // Check if primary piece and exit are aligned
    if (boardState.primaryPiece && boardState.exit) {
      const { isHorizontal } = boardState.primaryPiece
      const primaryRow = boardState.primaryPiece.cells[0][0]
      const primaryCol = boardState.primaryPiece.cells[0][1]
      const [exitRow, exitCol] = boardState.exit

      if (isHorizontal && exitRow !== primaryRow) {
        errors.push("Exit must be aligned with the primary piece's orientation (same row)")
      }

      if (!isHorizontal && exitCol !== primaryCol) {
        errors.push("Exit must be aligned with the primary piece's orientation (same column)")
      }
    }

    // Check if there are any pieces
    if (boardState.pieces.length === 0) {
      errors.push("At least one piece is required")
    }

    setValidationErrors(errors)
    setValidationSuccess(errors.length === 0)

    return errors.length === 0
  }

  // Generate puzzle text
  const generatePuzzleText = () => {
    if (!validatePuzzle()) return null

    // We need to generate the inner board without the border
    const innerBoard = []
    for (let r = 1; r < fullRows - 1; r++) {
      const row = []
      for (let c = 1; c < fullCols - 1; c++) {
        row.push(boardState.board[r][c])
      }
      innerBoard.push(row.join(""))
    }

    // Add the exit to the inner board representation
    if (boardState.exit) {
      const [exitRow, exitCol] = boardState.exit

      // Map the exit position to the inner board coordinates
      let innerExitRow = exitRow - 1
      let innerExitCol = exitCol - 1

      // If the exit is on the top or left border, it's outside the inner board
      // If it's on the bottom or right border, it's at the edge of the inner board
      if (exitRow === 0) innerExitRow = 0
      else if (exitRow === fullRows - 1) innerExitRow = innerRows - 1

      if (exitCol === 0) innerExitCol = 0
      else if (exitCol === fullCols - 1) innerExitCol = innerCols - 1

      // Replace the character at the exit position with 'K'
      const rowChars = innerBoard[innerExitRow].split("")
      rowChars[innerExitCol] = "K"
      innerBoard[innerExitRow] = rowChars.join("")
    }

    const pieceCount = boardState.pieces.length
    return `${innerRows} ${innerCols} ${pieceCount}\n${innerBoard.join("\n")}`
  }

  // Handle create puzzle button
  const handleCreatePuzzle = () => {
    const puzzleText = generatePuzzleText()
    if (puzzleText) {
      onPuzzleCreated(puzzleText)
    }
  }

  // Reset the board
  const resetBoard = () => {
    setBoardState({
      dimensions: [innerRows, innerCols],
      board: Array(innerRows + 2)
        .fill(null)
        .map(() => Array(innerCols + 2).fill(".")),
      pieces: [],
      primaryPiece: null,
      exit: null,
      selectedCells: [],
    })
    setValidationErrors([])
    setValidationSuccess(false)
  }

  // Get next available piece ID
  const getNextAvailablePiece = () => {
    const usedPieces = new Set(boardState.pieces.map((p) => p.id))
    const allPieces = Object.keys(PIECE_COLORS).filter((p) => p !== "P" && p !== "K")

    for (const piece of allPieces) {
      if (!usedPieces.has(piece)) {
        return piece
      }
    }

    return "A" // Fallback
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Board Settings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Inner Rows: {innerRows}</Label>
              <Slider value={[innerRows]} min={3} max={10} step={1} onValueChange={(value) => setInnerRows(value[0])} />
            </div>

            <div className="space-y-2">
              <Label>Inner Columns: {innerCols}</Label>
              <Slider value={[innerCols]} min={3} max={10} step={1} onValueChange={(value) => setInnerCols(value[0])} />
            </div>
          </div>

          <div className="p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              Total board size: {fullRows}×{fullCols} (including border for exits)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Editor Mode</Label>
            <Tabs defaultValue="place" value={mode} onValueChange={(value) => setMode(value as EditorMode)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="place">Place</TabsTrigger>
                <TabsTrigger value="erase">Erase</TabsTrigger>
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="exit">Exit</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {mode === "place" && (
            <div className="space-y-2">
              <Label>Current Piece</Label>
              <div className="flex items-center space-x-2">
                <Select value={currentPiece} onValueChange={setCurrentPiece}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(PIECE_COLORS)
                      .filter((p) => p !== "P" && p !== "K")
                      .map((piece) => (
                        <SelectItem key={piece} value={piece}>
                          <div className="flex items-center">
                            <div
                              className={cn("w-4 h-4 mr-2 rounded", PIECE_COLORS[piece as keyof typeof PIECE_COLORS])}
                            ></div>
                            {piece}
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" onClick={() => setCurrentPiece(getNextAvailablePiece())}>
                  Auto
                </Button>

                <div
                  className={cn(
                    "w-8 h-8 rounded flex items-center justify-center",
                    PIECE_COLORS[currentPiece as keyof typeof PIECE_COLORS],
                  )}
                >
                  {currentPiece}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Click two cells to place a piece, or click and drag.</p>
            </div>
          )}

          <div className="pt-4 space-y-2">
            <Button onClick={validatePuzzle} variant="outline" className="w-full">
              Validate Puzzle
            </Button>

            <div className="flex space-x-2">
              <Button onClick={handleCreatePuzzle} disabled={!validationSuccess} className="flex-1">
                Create Puzzle
              </Button>

              <Button onClick={resetBoard} variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc pl-4 mt-2">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {validationSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">Puzzle is valid and ready to solve!</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Puzzle Board</h3>

          <div className="inline-block border-2 border-gray-300 rounded-md overflow-hidden relative">
            {boardState.board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => {
                  const isBorder = isBorderCell(rowIndex, colIndex)
                  const isExit = isExitCell(rowIndex, colIndex)
                  const isSelected = boardState.selectedCells.some(([r, c]) => r === rowIndex && c === colIndex)

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center font-bold border transition-colors",
                        // Border cells have different styling
                        isBorder && !isExit ? "bg-gray-200 border-gray-300" : "border-gray-200 cursor-pointer",
                        // Cell content styling
                        cell === "."
                          ? isBorder && !isExit
                            ? "bg-gray-200"
                            : "bg-gray-100"
                          : PIECE_COLORS[cell as keyof typeof PIECE_COLORS],
                        // Selected cell styling
                        isSelected && "ring-2 ring-blue-500",
                        // Exit cell styling
                        isExit && "bg-green-500 text-white relative z-10",
                      )}
                      onMouseDown={() => {
                        setDragStart([rowIndex, colIndex])
                        setDragEnd(null)
                      }}
                      onMouseUp={() => {
                        if (dragStart) {
                          setDragEnd([rowIndex, colIndex])
                          handleCellDrag(dragStart[0], dragStart[1], rowIndex, colIndex)
                          setDragStart(null)
                          setDragEnd(null)
                        }
                      }}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell !== "." ? cell : ""}

                      {/* Add exit indicator */}
                      {isExit && (
                        <div
                          className={cn(
                            "absolute inset-0 pointer-events-none",
                            exitInfo?.direction === "top" && "border-t-4 border-t-green-600 -mt-2",
                            exitInfo?.direction === "bottom" && "border-b-4 border-b-green-600 -mb-2",
                            exitInfo?.direction === "left" && "border-l-4 border-l-green-600 -ml-2",
                            exitInfo?.direction === "right" && "border-r-4 border-r-green-600 -mr-2",
                          )}
                        ></div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Add exit path outside the board */}
            {exitInfo && (
              <div
                className={cn(
                  "absolute w-6 h-6 bg-green-600/20 border-2 border-green-600",
                  exitInfo.direction === "top" && "top-0 left-1/2 -translate-x-1/2 -translate-y-full rounded-t-md",
                  exitInfo.direction === "bottom" && "bottom-0 left-1/2 -translate-x-1/2 translate-y-full rounded-b-md",
                  exitInfo.direction === "left" && "left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-l-md",
                  exitInfo.direction === "right" && "right-0 top-1/2 translate-x-full -translate-y-1/2 rounded-r-md",
                )}
              ></div>
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-2">
              <div className={cn("px-2 py-1 rounded flex items-center", PIECE_COLORS.P)}>P = Primary Piece</div>
              <div className={cn("px-2 py-1 rounded flex items-center", PIECE_COLORS.K)}>K = Exit</div>
              <div className="px-2 py-1 rounded bg-gray-100 flex items-center">. = Empty Cell</div>
              <div className="px-2 py-1 rounded bg-gray-200 flex items-center">□ = Border (exits only)</div>
            </div>
          </div>
        </div>
      </div>

      {validationSuccess && (
        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="text-lg font-medium mb-2">Generated Puzzle Text:</h3>
          <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">{generatePuzzleText()}</pre>
        </div>
      )}
    </div>
  )
}
