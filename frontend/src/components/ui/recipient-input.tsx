'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

interface RecipientInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  generator?: () => string
  generatorTooltip?: string
}

export function RecipientInput({ 
  value, 
  onChange, 
  placeholder = "Анна К.", 
  label,
  generator,
  generatorTooltip = "Сгенерировать имя с инициалом"
}: RecipientInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

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
          onChange={handleChange}
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
      
      {value && !value.endsWith('.') && value.trim() && (
        <div className="mt-1 text-xs text-muted-foreground">
          В PDF будет: {value.trim()}.
        </div>
      )}
    </div>
  )
}

