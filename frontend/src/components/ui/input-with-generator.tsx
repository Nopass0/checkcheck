'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shuffle } from "lucide-react"

interface InputWithGeneratorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  generator?: () => string
  generatorTooltip?: string
}

export function InputWithGenerator({ 
  value, 
  onChange, 
  placeholder, 
  label, 
  generator,
  generatorTooltip = "Сгенерировать случайное значение"
}: InputWithGeneratorProps) {
  
  const handleGenerate = () => {
    if (generator) {
      onChange(generator())
    }
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        
        {generator && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGenerate}
            title={generatorTooltip}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
