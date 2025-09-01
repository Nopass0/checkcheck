'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Download, AlertCircle, CheckCircle } from 'lucide-react'

interface ReceiptData {
  date: string
  total: string
  sender: string
  phone_number: string
  recipient: string
  bank: string
  operation_id: string
  receipt_number: string
  card_number: string
}

export default function Home() {
  const [formData, setFormData] = useState<ReceiptData>({
    date: '',
    total: '',
    sender: '',
    phone_number: '',
    recipient: '',
    bank: '',
    operation_id: '',
    receipt_number: '',
    card_number: ''
  })
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [useTextInput, setUseTextInput] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const dataToSend = useTextInput ? { text: textInput } : formData
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка при генерации PDF')
      }

      // Получаем PDF как blob
      const blob = await response.blob()
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'receipt.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const parseTextInput = () => {
    const lines = textInput.trim().split('\n')
    if (lines.length === 9) {
      setFormData({
        date: lines[0],
        total: lines[1],
        sender: lines[2],
        phone_number: lines[3],
        recipient: lines[4],
        bank: lines[5],
        operation_id: lines[6],
        receipt_number: lines[7],
        card_number: lines[8]
      })
      setUseTextInput(false)
    } else {
      setError('Должно быть ровно 9 строк данных')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Генератор PDF Квитанций
            </h1>
            <p className="text-gray-600">
              Создайте квитанцию банковского перевода в формате PDF
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Данные для квитанции</CardTitle>
              <CardDescription>
                Заполните все поля или введите данные в текстовом формате
              </CardDescription>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={!useTextInput ? "default" : "outline"}
                  onClick={() => setUseTextInput(false)}
                  size="sm"
                >
                  Форма
                </Button>
                <Button
                  type="button"
                  variant={useTextInput ? "default" : "outline"}
                  onClick={() => setUseTextInput(true)}
                  size="sm"
                >
                  Текст
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {useTextInput ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="textInput">
                        Введите данные (9 строк):
                      </Label>
                      <Textarea
                        id="textInput"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={`Пример:
01.01.2024 12:00
1 000 
Иван Иванов
+7 900 123 45 67
Петр Петров
Тинькофф Банк
123456789
987654321
1234567890123456`}
                        className="min-h-[200px] font-mono text-sm"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={parseTextInput}
                      variant="outline"
                      className="w-full"
                    >
                      Заполнить форму из текста
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="date">Дата и время</Label>
                      <Input
                        id="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        placeholder="01.01.2024 12:00"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="total">Сумма перевода</Label>
                      <Input
                        id="total"
                        value={formData.total}
                        onChange={(e) => setFormData({...formData, total: e.target.value})}
                        placeholder="1 000 "
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sender">Отправитель</Label>
                      <Input
                        id="sender"
                        value={formData.sender}
                        onChange={(e) => setFormData({...formData, sender: e.target.value})}
                        placeholder="Иван Иванов"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone_number">Номер телефона</Label>
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        placeholder="+7 900 123 45 67"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="recipient">Получатель</Label>
                      <Input
                        id="recipient"
                        value={formData.recipient}
                        onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                        placeholder="Петр Петров"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bank">Банк</Label>
                      <Input
                        id="bank"
                        value={formData.bank}
                        onChange={(e) => setFormData({...formData, bank: e.target.value})}
                        placeholder="Тинькофф Банк"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="operation_id">Идентификатор операции</Label>
                      <Input
                        id="operation_id"
                        value={formData.operation_id}
                        onChange={(e) => setFormData({...formData, operation_id: e.target.value})}
                        placeholder="123456789"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="receipt_number">Номер квитации</Label>
                      <Input
                        id="receipt_number"
                        value={formData.receipt_number}
                        onChange={(e) => setFormData({...formData, receipt_number: e.target.value})}
                        placeholder="987654321"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="card_number">Счет списания</Label>
                      <Input
                        id="card_number"
                        value={formData.card_number}
                        onChange={(e) => setFormData({...formData, card_number: e.target.value})}
                        placeholder="1234567890123456"
                        required
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span>PDF успешно сгенерирован и скачан!</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Генерация PDF...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Сгенерировать PDF
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Инструкция:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Заполните все 9 полей данными для квитанции</li>
              <li>• Или используйте текстовый формат (каждое поле с новой строки)</li>
              <li>• Сумма должна содержать пробел между тысячами (например: "1 000")</li>
              <li>• После генерации PDF автоматически скачается</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}