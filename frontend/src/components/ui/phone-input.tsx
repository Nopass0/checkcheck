'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function PhoneInput({ value, onChange, placeholder = "+7 (985) 535-25-11", label }: PhoneInputProps) {
  
  const formatPhone = (input: string) => {
    // Удаляем все кроме цифр
    let numbers = input.replace(/\D/g, '')
    
    // Если начинается с 8, заменяем на 7
    if (numbers.startsWith('8')) {
      numbers = '7' + numbers.slice(1)
    }
    
    // Если не начинается с 7, добавляем 7
    if (!numbers.startsWith('7') && numbers.length > 0) {
      numbers = '7' + numbers
    }
    
    // Ограничиваем до 11 цифр
    numbers = numbers.slice(0, 11)
    
    // Форматируем по маске +7 (XXX) XXX-XX-XX
    if (numbers.length === 0) {
      return ''
    } else if (numbers.length === 1) {
      return '+7'
    } else if (numbers.length <= 4) {
      return `+7 (${numbers.slice(1)}`
    } else if (numbers.length <= 7) {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4)}`
    } else if (numbers.length <= 9) {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`
    } else {
      return `+7 (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    onChange(formatted)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем только цифры, backspace, delete и навигационные клавиши
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
    if (!allowedKeys.includes(e.key) && !/\d/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div>
      {label && <Label htmlFor="phone">{label}</Label>}
      <Input
        id="phone"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={18} // +7 (XXX) XXX-XX-XX
      />
    </div>
  )
}
