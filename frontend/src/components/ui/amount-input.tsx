'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  generator?: () => string
  generatorTooltip?: string
}

export function AmountInput({ 
  value, 
  onChange, 
  placeholder = "1 500 ", 
  label,
  generator,
  generatorTooltip = "Сгенерировать случайную сумму"
}: AmountInputProps) {
  
  const formatAmount = (input: string) => {
    // Удаляем все кроме цифр
    let numbers = input.replace(/\D/g, '')
    
    // Если пустая строка, возвращаем пустую
    if (!numbers) return ''
    
    // Преобразуем в число и обратно для удаления ведущих нулей
    const num = parseInt(numbers, 10)
    if (isNaN(num)) return ''
    
    // Форматируем с пробелами между тысячами и добавляем пробел в конце
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' '
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value)
    onChange(formatted)
  }

  const handleGenerate = () => {
    if (generator) {
      onChange(generator())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только цифры, backspace, delete и навигационные клавиши
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter']
    if (!allowedKeys.includes(e.key) && !/\d/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
