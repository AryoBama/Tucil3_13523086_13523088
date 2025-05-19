"use client"

import { useState } from "react"
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
  const [exitRow, setExitRow] = useState<number | null>(null);
  const [exitCol, setExitCol] = useState<number | null>(null);    
  const [inputText, setInputText] = useState<string>("")
  const [algorithm, setAlgorithm] = useState<string>("AStar")
  const [heuristic, setHeuristic] = useState<string>("BlockingChain")
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
      setPuzzle(parsedPuzzle)
      setExitRow(parsedPuzzle.dimensions[0])
      setExitCol(parsedPuzzle.dimensions[1])
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
      setExitRow(parsedPuzzle.dimensions[0])
      setExitCol(parsedPuzzle.dimensions[1])
      setSolution(null)
      setCurrentStep(0)
      setStats(null)
      setActiveTab("solver")
    } catch (error) {
      console.error("Error parsing puzzle:", error)
      alert("Error parsing puzzle. Please check the format.")
    }
  }

  const solvePuzzle = async (puzzleText: string, algorithm: string, heuristic: string) => {
    setIsLoading(true);

    try {
      const backendResult = await sendParsedData(puzzleText, algorithm, heuristic);
      console.log(backendResult)

      setStats({
        nodesVisited: backendResult.cntNode ?? 0,
        executionTime: backendResult.time ?? 0,
      });
      if (!backendResult || backendResult.steps.length == 0) {
        alert("No solution found!");
        setIsLoading(false);
        return;
      }

      setPuzzle(backendResult.puzzle || puzzle);
      setSolution(backendResult.solution || backendResult);

    } catch (error) {
      console.error("Error solving puzzle:", error);
      alert("Error solving puzzle: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = () => {
    if (solution && currentStep < solution.steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleAnimate = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const stepDelay = 300; 

    let stepIndex = currentStep;

    const stepInterval = setInterval(() => {
      stepIndex = (stepIndex + 1) % (solution.steps.length + 1);
      setCurrentStep(stepIndex);

      if (stepIndex === solution.steps.length) {
        clearInterval(stepInterval);
        setIsAnimating(false); 
      }
    }, stepDelay);
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
      <h1 className="text-3xl font-bold text-center my-6">Rush Hour Solver</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Puzzle Editor</TabsTrigger>
          <TabsTrigger value="solver">Puzzle Solver</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rush Hour Solver</CardTitle>
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

                    <HeuristicSelector value={heuristic} onChange={setHeuristic} disabled={algorithm !== "AStar"} />
                  </div>

                  <Button onClick={() => solvePuzzle(inputText, algorithm, heuristic)} disabled={!puzzle || isLoading} className="w-full">
                    {isLoading ? "Solving..." : "Solve Puzzle"}
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                      <Board
                        puzzle={puzzle}
                        solution={solution}
                        currentStep={currentStep}
                        exitRow={exitRow ?? 0}
                        exitCol={exitCol ?? 0}
                      />

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
                    <StepDisplay puzzle={puzzle} solution={solution} exitRow={exitRow} exitCol={exitCol} />
                  ) : (
                    <p className="text-center text-muted-foreground">Solve the puzzle to see step-by-step solution</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            </Tabs>
          </div>

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
        </TabsContent>
      </Tabs>
    </main>
  )
}