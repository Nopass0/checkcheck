'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function DateTimePicker({ value, onChange, placeholder = "01.02.2025 12:23:43", label }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState("")
  const [selectedTime, setSelectedTime] = React.useState("")

  // Парсим текущее значение
  React.useEffect(() => {
    if (value) {
      const parts = value.split(' ')
      if (parts.length >= 2) {
        setSelectedDate(parts[0])
        setSelectedTime(parts[1])
      }
    }
  }, [value])

  // Генерируем текущую дату и время
  const generateNow = () => {
    const now = new Date()
    const date = now.toLocaleDateString('ru-RU').replace(/\//g, '.')
    const time = now.toLocaleTimeString('ru-RU', { hour12: false })
    const dateTime = `${date} ${time}`
    onChange(dateTime)
    setSelectedDate(date)
    setSelectedTime(time)
  }

  // Обработка изменения даты
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    if (selectedTime) {
      onChange(`${newDate} ${selectedTime}`)
    }
  }

  // Обработка изменения времени
  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime)
    if (selectedDate) {
      onChange(`${selectedDate} ${newTime}`)
    }
  }

  // Валидация и форматирование даты
  const formatDate = (input: string) => {
    // Удаляем все кроме цифр
    const numbers = input.replace(/\D/g, '')
    
    // Форматируем как ДД.ММ.ГГГГ
    if (numbers.length >= 8) {
      const day = numbers.slice(0, 2)
      const month = numbers.slice(2, 4)
      const year = numbers.slice(4, 8)
      return `${day}.${month}.${year}`
    } else if (numbers.length >= 4) {
      const day = numbers.slice(0, 2)
      const month = numbers.slice(2, 4)
      const year = numbers.slice(4)
      return `${day}.${month}.${year}`
    } else if (numbers.length >= 2) {
      const day = numbers.slice(0, 2)
      const month = numbers.slice(2)
      return `${day}.${month}`
    }
    return numbers
  }

  // Валидация и форматирование времени
  const formatTime = (input: string) => {
    // Удаляем все кроме цифр
    const numbers = input.replace(/\D/g, '')
    
    // Форматируем как ЧЧ:ММ:СС
    if (numbers.length >= 6) {
      const hours = numbers.slice(0, 2)
      const minutes = numbers.slice(2, 4)
      const seconds = numbers.slice(4, 6)
      return `${hours}:${minutes}:${seconds}`
    } else if (numbers.length >= 4) {
      const hours = numbers.slice(0, 2)
      const minutes = numbers.slice(2, 4)
      const seconds = numbers.slice(4)
      return `${hours}:${minutes}:${seconds}`
    } else if (numbers.length >= 2) {
      const hours = numbers.slice(0, 2)
      const minutes = numbers.slice(2)
      return `${hours}:${minutes}`
    }
    return numbers
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateNow}
          title="Текущее время"
        >
          <Clock className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          title="Выбрать дату и время"
        >
          <Calendar className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && (
        <div className="mt-2 p-4 border rounded-lg bg-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date-input">Дата (ДД.ММ.ГГГГ)</Label>
              <Input
                id="date-input"
                value={selectedDate}
                onChange={(e) => handleDateChange(formatDate(e.target.value))}
                placeholder="01.02.2025"
                maxLength={10}
              />
            </div>
            
            <div>
              <Label htmlFor="time-input">Время (ЧЧ:ММ:СС)</Label>
              <Input
                id="time-input"
                value={selectedTime}
                onChange={(e) => handleTimeChange(formatTime(e.target.value))}
                placeholder="12:23:43"
                maxLength={8}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date()
                const date = now.toLocaleDateString('ru-RU').replace(/\//g, '.')
                handleDateChange(date)
              }}
            >
              Сегодня
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date()
                const time = now.toLocaleTimeString('ru-RU', { hour12: false })
                handleTimeChange(time)
              }}
            >
              Сейчас
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="ml-auto"
            >
              Готово
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
