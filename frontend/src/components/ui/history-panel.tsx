'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, History, Eye, Calendar, FileText } from "lucide-react"

interface HistoryItem {
  filename: string
  timestamp: string
  data: {
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
  size: number
}

interface HistoryPanelProps {
  onDataSelect?: (data: HistoryItem['data']) => void
}

export function HistoryPanel({ onDataSelect }: HistoryPanelProps) {
  const [history, setHistory] = React.useState<HistoryItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)

  // Загружаем историю
  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/history')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.history || [])
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error)
    } finally {
      setLoading(false)
    }
  }

  // Загружаем историю при монтировании
  React.useEffect(() => {
    loadHistory()
  }, [])

  // Скачивание PDF
  const downloadPdf = async (filename: string) => {
    try {
      const response = await fetch(`/api/download/${filename}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Ошибка скачивания:', error)
    }
  }

  // Форматирование даты
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Форматирование размера файла
  const formatSize = (bytes: number) => {
    const kb = bytes / 1024
    return `${kb.toFixed(1)} КБ`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            История генераций
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Обновить'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>История пуста</p>
            <p className="text-sm">Сгенерируйте первый PDF</p>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.filename} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.timestamp)}</span>
                  <span className="text-muted-foreground">({formatSize(item.size)})</span>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedItem(
                      expandedItem === item.filename ? null : item.filename
                    )}
                    title="Просмотр данных"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPdf(item.filename)}
                    title="Скачать PDF"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  
                  {onDataSelect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDataSelect(item.data)}
                      title="Использовать эти данные"
                    >
                      ↩
                    </Button>
                  )}
                </div>
              </div>

              {expandedItem === item.filename && (
                <div className="mt-2 p-2 bg-muted rounded text-xs space-y-1">
                  <div><strong>Сумма:</strong> {item.data.total}</div>
                  <div><strong>От:</strong> {item.data.sender}</div>
                  <div><strong>Кому:</strong> {item.data.recipient}</div>
                  <div><strong>Телефон:</strong> {item.data.phone_number}</div>
                  <div><strong>Банк:</strong> {item.data.bank}</div>
                  <div><strong>Операция:</strong> {item.data.operation_id}</div>
                  <div><strong>Квитанция:</strong> {item.data.receipt_number}</div>
                  <div><strong>Счет:</strong> {item.data.card_number}</div>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
