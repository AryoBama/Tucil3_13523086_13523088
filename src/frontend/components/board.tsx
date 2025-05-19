"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface BoardProps {
  puzzle: any
  solution: any
  currentStep: number
  exitRow: number
  exitCol: number
}

export function Board({ puzzle, solution, currentStep, exitRow, exitCol }: BoardProps) {
  const currentBoard = useMemo(() => {
    if (!solution || currentStep === 0 || currentStep > solution.steps.length) {
      return puzzle.initialBoard
    }
    
    return solution.steps[currentStep - 1].board
  }, [puzzle, solution, currentStep, exitRow, exitCol])

  const lastMovedPiece = useMemo(() => {
    if (!solution || currentStep === 0 || currentStep > solution.steps.length) {
      return null
    }
    return solution.steps[currentStep - 1].piece
  }, [solution, currentStep])

  // Get unique pieces for color assignment
  const uniquePieces = useMemo(() => {
    const pieces = new Set<string>()
    for (const row of currentBoard) {
      for (const cell of row) {
        if (cell !== "." && cell !== "K") {
          pieces.add(cell)
        }
      }
    }
    return Array.from(pieces)
  }, [currentBoard])

  // Generate colors for pieces
  const pieceColors = useMemo(() => {
    const colors: Record<string, string> = {}

    uniquePieces.forEach((piece) => {
      colors[piece] = "bg-blue-300";
    });

    colors["P"] = "bg-red-500 text-white"
    colors["K"] = "bg-green-500 text-white"

    // Last moved piece
    if (lastMovedPiece && lastMovedPiece !== "P") {
      colors[lastMovedPiece] = "bg-yellow-500 text-white"
    }

    return colors
  }, [uniquePieces, lastMovedPiece])

  const exitInfo = useMemo(() => {
    if (!puzzle.exit) return null

    const [exitRow, exitCol] = puzzle.exit
    const rows = currentBoard.length
    const cols = currentBoard[0].length

    let direction = ""
    if (exitRow === 0) direction = "top"
    else if (exitRow === rows - 1) direction = "bottom"
    else if (exitCol === 0) direction = "left"
    else if (exitCol === cols - 1) direction = "right"

    return { row: exitRow, col: exitCol, direction }
  }, [puzzle.exit, currentBoard])

  // Check if a cell is in the border
  const isBorderCell = (row: number, col: number) => {
    const rows = currentBoard.length
    const cols = currentBoard[0].length
    return row === 0 || row === rows - 1 || col === 0 || col === cols - 1
  }

  // Check if a cell is the exit
  const isExitCell = (row: number, col: number) => {
    return exitInfo && exitInfo.row === row && exitInfo.col === col
  }

  return (
    <div className="inline-block border-2 border-gray-300 rounded-md overflow-hidden relative">
      {currentBoard.map((row: string[], rowIndex: number) => (
        <div key={rowIndex} className="flex">
          {row.map((cell: string, colIndex: number) => {
            const isBorder = isBorderCell(rowIndex, colIndex)
            const isExit = isExitCell(rowIndex, colIndex)

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "w-12 h-12 flex items-center justify-center font-bold border",
                  isBorder && !isExit ? "bg-gray-200 border-gray-300" : "border-gray-200",
                  cell === "." ? (isBorder ? "bg-gray-200" : "bg-gray-100") : pieceColors[cell],
                  isExit && "bg-green-500 text-white relative z-10",
                )}
              >
                {isExit ? "K" : cell !== "." ? cell : ""}

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
  )
}
