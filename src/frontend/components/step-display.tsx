"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Board } from "@/components/board"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { sendParsedData } from "@/lib/parser"

interface StepDisplayProps {
  puzzle: any
  solution: any
  exitRow: any
  exitCol: any
}

export function StepDisplay({ puzzle, solution }: StepDisplayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = solution.steps.length

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const getCurrentStepDescription = () => {
    if (currentStep === 0) {
      return "Initial Board"
    }

    const step = solution.steps[currentStep - 1]
    return `Step ${currentStep}: Move piece ${step.piece} ${step.direction}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <div className="text-lg font-medium">{getCurrentStepDescription()}</div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <Button variant="outline" size="icon" onClick={handleNext} disabled={currentStep >= totalSteps}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-center">
        <Board
          puzzle={puzzle}
          solution={solution}
          currentStep={currentStep}
          exitRow={puzzle.exitRow}
          exitCol={puzzle.exitCol}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Solution Steps:</h3>
        <div className="max-h-96 overflow-y-auto space-y-2 p-2 border rounded-md">
          <div className="p-2 rounded bg-gray-100">
            <strong>Initial Board</strong>
          </div>

          {solution.steps.map((step: any, index: number) => (
            <div
              key={index}
              className={cn("p-2 rounded", currentStep === index + 1 ? "bg-blue-100" : "bg-gray-50")}
              onClick={() => setCurrentStep(index + 1)}
            >
              <strong>Step {index + 1}:</strong> Move piece {step.piece} {step.direction}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Example: src/frontend/app/solver-page.tsx
export default function SolverPage() {
  const [puzzle, setPuzzle] = useState<any>(null)
  const [solution, setSolution] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Call this when you want to send input and get the solution
  const handleSolve = async (input: string) => {
    setLoading(true)
    const data = await sendParsedData(input)
    setLoading(false)
    if (data) {
      setPuzzle(data.puzzle) // adjust if your backend returns a different structure
      setSolution(data.solution) // adjust if your backend returns a different structure
    }
  }

  // Example usage: call handleSolve with your puzzle input string
  // handleSolve("your puzzle input here");

  return (
    <div>
      {/* Add your input UI and a button to trigger handleSolve */}
      {loading && <div>Loading...</div>}
      {puzzle && solution && (
        <StepDisplay
          puzzle={puzzle}
          solution={solution}
          exitRow={puzzle.exitRow}
          exitCol={puzzle.exitCol}
        />
      )}
    </div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
