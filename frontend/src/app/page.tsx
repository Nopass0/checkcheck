'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/ui/datetime-picker'
import { PhoneInput } from '@/components/ui/phone-input'
import { InputWithGenerator } from '@/components/ui/input-with-generator'

import { ReceiptInput } from '@/components/ui/receipt-input'
import { RecipientInput } from '@/components/ui/recipient-input'
import { HistoryPanel } from '@/components/ui/history-panel'
import { FileText, Download, AlertCircle, CheckCircle, Shuffle, Trash2 } from 'lucide-react'
import { 
  generateCardNumber, 
  generateOperationId, 
  generateReceiptNumber, 
  generateRandomAmount,
  generateSenderName,
  generateRecipientName,
  generateRandomPhone,
  generateRandomBank
} from '@/lib/generators'

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

  // Функция очистки всех полей
  const clearAllFields = () => {
    setFormData({
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
    setTextInput('')
    setError('')
    setSuccess(false)
  }

  // Функция генерации всех случайных данных
  const generateAllRandomData = () => {
    const now = new Date()
    const date = now.toLocaleDateString('ru-RU').replace(/\//g, '.')
    const time = now.toLocaleTimeString('ru-RU', { hour12: false })
    
    setFormData({
      date: `${date} ${time}`,
      total: generateRandomAmount(),
      sender: generateSenderName(),
      phone_number: generateRandomPhone(),
      recipient: generateRecipientName(),
      bank: generateRandomBank(),
      operation_id: generateOperationId(),
      receipt_number: generateReceiptNumber(),
      card_number: generateCardNumber()
    })
  }

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
      
      // Очищаем поля после успешного скачивания
      setTimeout(() => {
        clearAllFields()
      }, 3000) // Показываем сообщение об успехе 3 секунды, затем очищаем
      
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

  // Обработчик выбора данных из истории
  const handleHistorySelect = (data: ReceiptData) => {
    setFormData(data)
    setUseTextInput(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Генератор PDF Квитанций
            </h1>
            <p className="text-gray-600">
              Создайте квитанцию банковского перевода в формате PDF
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Основная форма */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Данные для квитанции</CardTitle>
                  <CardDescription>
                    Заполните все поля или введите данные в текстовом формате
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2">
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateAllRandomData}
                      size="sm"
                      className="ml-auto"
                    >
                      <Shuffle className="w-4 h-4 mr-2" />
                      Случайные данные
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearAllFields}
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Очистить
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
01.02.2025 12:23:43
2000
Игорь Васильев
+7 (985) 535-25-11
Анна К.
Тинькофф Банк
A52351158320990600000200115
1-115-078-540-299
408178102000****7022`}
                            className="min-h-[250px] font-mono text-sm"
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
                        <DateTimePicker
                          label="Дата и время"
                          value={formData.date}
                          onChange={(value) => setFormData({...formData, date: value})}
                          placeholder="01.02.2025 12:23:43"
                        />
                        
                        <InputWithGenerator
                          label="Сумма перевода"
                          value={formData.total}
                          onChange={(value) => setFormData({...formData, total: value})}
                          placeholder="2000"
                          generator={generateRandomAmount}
                          generatorTooltip="Сгенерировать случайную сумму"
                        />
                        
                        <InputWithGenerator
                          label="Отправитель"
                          value={formData.sender}
                          onChange={(value) => setFormData({...formData, sender: value})}
                          placeholder="Игорь Васильев"
                          generator={generateSenderName}
                          generatorTooltip="Сгенерировать полное имя"
                        />
                        
                        <PhoneInput
                          label="Номер телефона"
                          value={formData.phone_number}
                          onChange={(value) => setFormData({...formData, phone_number: value})}
                          placeholder="+7 (985) 535-25-11"
                        />
                        
                        <RecipientInput
                          label="Получатель"
                          value={formData.recipient}
                          onChange={(value) => setFormData({...formData, recipient: value})}
                          placeholder="Анна К."
                          generator={generateRecipientName}
                          generatorTooltip="Сгенерировать имя с инициалом"
                        />
                        
                        <InputWithGenerator
                          label="Банк"
                          value={formData.bank}
                          onChange={(value) => setFormData({...formData, bank: value})}
                          placeholder="Тинькофф Банк"
                          generator={generateRandomBank}
                          generatorTooltip="Выбрать случайный банк"
                        />
                        
                        <InputWithGenerator
                          label="Идентификатор операции"
                          value={formData.operation_id}
                          onChange={(value) => setFormData({...formData, operation_id: value})}
                          placeholder="A523511583209906000002001157"
                          generator={generateOperationId}
                          generatorTooltip="Сгенерировать ID операции"
                        />
                        
                        <ReceiptInput
                          label="Номер квитанции"
                          value={formData.receipt_number}
                          onChange={(value) => setFormData({...formData, receipt_number: value})}
                          placeholder="1-115-078-540-299"
                          generator={generateReceiptNumber}
                          generatorTooltip="Сгенерировать номер квитанции"
                        />
                        
                        <InputWithGenerator
                          label="Счет списания"
                          value={formData.card_number}
                          onChange={(value) => setFormData({...formData, card_number: value})}
                          placeholder="408178102000****7022"
                          generator={generateCardNumber}
                          generatorTooltip="Сгенерировать номер карты"
                        />
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
                        <span>PDF успешно сгенерирован и скачан! Поля будут очищены через 3 секунды.</span>
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

              <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Инструкция:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Заполните все 9 полей данными для квитанции</li>
                  <li>• Используйте кнопки <Shuffle className="w-3 h-3 inline" /> для генерации случайных данных</li>
                  <li>• <strong>Сумма:</strong> вводите просто число (2000) - в чеке станет "2 000"</li>
                  <li>• <strong>Отправитель:</strong> полное имя (Игорь Васильев)</li>
                  <li>• <strong>Получатель:</strong> имя + инициал (Анна К) - точка добавится автоматически</li>
                  <li>• <strong>Телефон:</strong> автоматически форматируется при вводе</li>
                  <li>• <strong>Дата:</strong> используйте календарь или введите текстом</li>
                  <li>• <strong>История:</strong> все PDF сохраняются справа, можно скачать повторно</li>
                </ul>
              </div>
            </div>

            {/* Панель истории */}
            <div className="lg:col-span-1">
              <HistoryPanel onDataSelect={handleHistorySelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}