'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

interface ReceiptInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  generator?: () => string
  generatorTooltip?: string
}

export function ReceiptInput({ 
  value, 
  onChange, 
  placeholder = "1-115-078-540-299", 
  label,
  generator,
  generatorTooltip = "Сгенерировать номер квитанции"
}: ReceiptInputProps) {
  
  const formatReceiptNumber = (input: string) => {
    // Удаляем все знаки № и лишние пробелы
    let cleaned = input.replace(/№/g, '').trim()
    
    // Возвращаем очищенное значение
    return cleaned
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatReceiptNumber(e.target.value)
    onChange(formatted)
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
      
      {value && (
        <div className="mt-1 text-xs text-muted-foreground">
          В PDF будет: № {value}
        </div>
      )}
    </div>
  )
}
