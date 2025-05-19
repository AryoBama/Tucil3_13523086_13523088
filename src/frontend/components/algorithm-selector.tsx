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
          <RadioGroupItem value="AStar" id="AStar" />
          <Label htmlFor="AStar">A* Search</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="UCS" id="UCS" />
          <Label htmlFor="UCS">Uniform Cost Search (UCS)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="GBFS" id="GBFS" />
          <Label htmlFor="GBFS">Greedy Best-First Search</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="IDA" id="IDA" />
          <Label htmlFor="IDA">Iterative deepening A* Search</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
