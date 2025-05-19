"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AlgorithmSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AlgorithmSelector({ value, onChange }: AlgorithmSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Pathfinding Algorithm</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="astar" id="astar" />
          <Label htmlFor="astar">A* Search</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="bfs" id="bfs" />
          <Label htmlFor="bfs">Uniform Cost Search (UCS)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="greedy" id="greedy" />
          <Label htmlFor="greedy">Greedy Best-First Search</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
