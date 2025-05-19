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
          <RadioGroupItem value="BlockingCar" id="BlockingCar" disabled={disabled} />
          <Label htmlFor="BlockingCar" className={disabled ? "text-muted-foreground" : ""}>
            Blocking Car
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="BlockingChain" id="BlockingChain" disabled={disabled} />
          <Label htmlFor="BlockingChain" className={disabled ? "text-muted-foreground" : ""}>
            Blocking Chain
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
