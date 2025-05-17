"use client"

import { useState } from "react"
import { PuzzleSolver } from "../lib/puzzle-solver"
import { sendParsedData, parseInputFile} from "../lib/parser"
import { Board } from "../components/board"
import { StepDisplay } from "../components/step-display"
import { FileUpload } from "../components/file-upload"
import { PuzzleEditor } from "../components/puzzle-editor"
import { AlgorithmSelector } from "../components/algorithm-selector"
import { HeuristicSelector } from "../components/heuristic-selector"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

export default function Home() {
  const [inputText, setInputText] = useState<string>("")
  const [algorithm, setAlgorithm] = useState<string>("astar")
  const [heuristic, setHeuristic] = useState<string>("manhattan")
  const [puzzle, setPuzzle] = useState<any>(null)
  const [solution, setSolution] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [stats, setStats] = useState<{ nodesVisited: number; executionTime: number } | null>(null)
  const [activeTab, setActiveTab] = useState<string>("editor")
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFileUpload = (content: string) => {
    setInputText(content)
    try {
      const parsedPuzzle = parseInputFile(content)
      sendParsedData(content)
      setPuzzle(parsedPuzzle)
      setSolution(null)
      setCurrentStep(0)
      setStats(null)
    } catch (error) {
      console.error("Error parsing input file:", error)
      alert("Error parsing input file. Please check the format.")
    }
  }

  const handlePuzzleCreated = (puzzleText: string) => {
    setInputText(puzzleText)
    try {
      const parsedPuzzle = parseInputFile(puzzleText)
      setPuzzle(parsedPuzzle)
      setSolution(null)
      setCurrentStep(0)
      setStats(null)
      setActiveTab("solver")
    } catch (error) {
      console.error("Error parsing puzzle:", error)
      alert("Error parsing puzzle. Please check the format.")
    }
  }

  const solvePuzzle = (puzzleText: string) => {
    sendParsedData(puzzleText)
    if (!puzzle) return

    setIsLoading(true)

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        const solver = new PuzzleSolver(puzzle, algorithm, heuristic)
        const startTime = performance.now()
        const result = solver.solve()
        const endTime = performance.now()

        if (result) {
          setSolution(result)
          setStats({
            nodesVisited: solver.getNodesVisited(),
            executionTime: endTime - startTime,
          })
        } else {
          alert("No solution found!")
        }
      } catch (error) {
        console.error("Error solving puzzle:", error)
        alert("Error solving puzzle: " + (error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }, 100)
  }

  const handleNext = () => {
    if (solution && currentStep < solution.steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleAnimate = () => {
    // Prevent multiple animations from running at the same time
    if (isAnimating) return;

    setIsAnimating(true);

    // Set a delay (for animation effect)
    let stepDelay = 200; // 300ms delay per step

    // Increment the step gradually with setTimeout
    let stepIndex = currentStep;

    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % solution.steps.length;
      setCurrentStep(stepIndex);

      // Stop the interval when we have completed the animation cycle
      if (stepIndex === solution.steps.length - 1) {
        setCurrentStep(solution.steps.length);
        clearInterval(stepInterval);
        setIsAnimating(false); // Re-enable the animation button
      }
    }, stepDelay); // Adjust stepDelay for desired speed
};

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Sliding Block Puzzle Solver</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Puzzle Editor</TabsTrigger>
          <TabsTrigger value="solver">Puzzle Solver</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Puzzle Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <PuzzleEditor onPuzzleCreated={handlePuzzleCreated} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solver" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FileUpload onFileLoaded={handleFileUpload} text={inputText} setText={setInputText} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AlgorithmSelector value={algorithm} onChange={setAlgorithm} />

                    <HeuristicSelector value={heuristic} onChange={setHeuristic} disabled={algorithm !== "astar"} />
                  </div>

                  <Button onClick={() => solvePuzzle(inputText)} disabled={!puzzle || isLoading} className="w-full">
                    {isLoading ? "Solving..." : "Solve Puzzle"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Nodes Visited:</strong> {stats.nodesVisited}
                    </p>
                    <p>
                      <strong>Execution Time:</strong> {stats.executionTime.toFixed(2)} ms
                    </p>
                    <p>
                      <strong>Solution Steps:</strong> {solution?.steps.length || 0}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Solve the puzzle to see statistics</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="visualization" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {puzzle && (
                    <div className="flex flex-col items-center">
                      <Board puzzle={puzzle} solution={solution} currentStep={currentStep} />

                      {solution && (
                        <div className="flex gap-2 mt-4">
                          <Button onClick={handleReset}>
                            Reset
                          </Button>
                          <Button onClick={handlePrev} disabled={currentStep === 0}>
                            Previous
                          </Button>
                          <Button onClick={handleNext} >
                            Next
                          </Button>
                          <Button onClick={handleAnimate} >
                            Animate
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="steps" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {solution ? (
                    <StepDisplay puzzle={puzzle} solution={solution} />
                  ) : (
                    <p className="text-center text-muted-foreground">Solve the puzzle to see step-by-step solution</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </main>
  )
}