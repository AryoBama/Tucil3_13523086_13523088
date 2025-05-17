"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface HeuristicSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function HeuristicSelector({ value, onChange, disabled = false }: HeuristicSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className={disabled ? "text-muted-foreground" : ""}>Heuristic Function</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex flex-col space-y-1" disabled={disabled}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manhattan" id="manhattan" disabled={disabled} />
          <Label htmlFor="manhattan" className={disabled ? "text-muted-foreground" : ""}>
            Manhattan Distance
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="euclidean" id="euclidean" disabled={disabled} />
          <Label htmlFor="euclidean" className={disabled ? "text-muted-foreground" : ""}>
            Euclidean Distance
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="custom" id="custom" disabled={disabled} />
          <Label htmlFor="custom" className={disabled ? "text-muted-foreground" : ""}>
            Custom Heuristic
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
