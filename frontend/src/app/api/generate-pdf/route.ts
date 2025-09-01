import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

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

interface TextInput {
  text: string
}

function parseTextInput(text: string): ReceiptData {
  const lines = text.trim().split('\n')
  if (lines.length !== 9) {
    throw new Error('Должно быть ровно 9 строк данных')
  }

  return {
    date: lines[0],
    total: lines[1],
    sender: lines[2],
    phone_number: lines[3],
    recipient: lines[4],
    bank: lines[5],
    operation_id: lines[6],
    receipt_number: lines[7],
    card_number: lines[8]
  }
}

function formatDataForBot(data: ReceiptData): string {
  return [
    data.date,
    data.total,
    data.sender,
    data.phone_number,
    data.recipient,
    data.bank,
    data.operation_id,
    data.receipt_number,
    data.card_number
  ].join('\n')
}

export async function POST(request: NextRequest) {
  try {
    // Настройка CORS
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    const body = await request.json()
    let receiptData: ReceiptData

    // Проверяем, текстовый ввод или структурированные данные
    if ('text' in body) {
      receiptData = parseTextInput((body as TextInput).text)
    } else {
      receiptData = body as ReceiptData
    }

    // Валидация данных
    const requiredFields = ['date', 'total', 'sender', 'phone_number', 'recipient', 'bank', 'operation_id', 'receipt_number', 'card_number']
    for (const field of requiredFields) {
      if (!receiptData[field as keyof ReceiptData]) {
        return NextResponse.json(
          { error: `Поле "${field}" обязательно для заполнения` },
          { status: 400, headers }
        )
      }
    }

    // Пути к файлам
    const botPath = path.join(process.cwd(), '..', 'bot.py')
    const ishodnikPath = path.join(process.cwd(), '..', 'ishodnik.pdf')
    const outputPath = path.join(process.cwd(), '..', 'nf.pdf')

    // Проверяем существование файлов
    try {
      await fs.access(botPath)
      await fs.access(ishodnikPath)
    } catch (error) {
      return NextResponse.json(
        { error: 'Файлы бота или шаблона PDF не найдены' },
        { status: 500, headers }
      )
    }

    // Форматируем данные для бота
    const formattedData = formatDataForBot(receiptData)

    // Создаем временный файл с данными
    const tempDataFile = path.join(process.cwd(), '..', 'temp_data.txt')
    await fs.writeFile(tempDataFile, formattedData, 'utf-8')

    try {
      // Пробуем разные варианты запуска Python
      const pythonCommands = [
        // Виртуальное окружение
        `.venv/bin/python`,
        // Системный Python
        `python3`,
        `python`
      ]
      
      let success = false
      let lastError = ''
      const baseDir = path.dirname(botPath)
      
      for (const pythonCmd of pythonCommands) {
        try {
          const pythonScript = `
import sys
sys.path.append('.')
from bot import generate_file

with open('temp_data.txt', 'r', encoding='utf-8') as f:
    data = f.read()

result = generate_file(data)
if result['status'] == 'error':
    print('ERROR: ' + str(result['error']))
    sys.exit(1)
else:
    print('SUCCESS')
`
          
          const { stdout, stderr } = await execAsync(
            `cd ${baseDir} && ${pythonCmd} -c "${pythonScript.replace(/"/g, '\\"')}"`,
            { shell: '/bin/bash' }
          )
          
          if (stderr && stderr.includes('ERROR:')) {
            throw new Error(stderr.replace('ERROR: ', ''))
          }

          if (stdout.includes('SUCCESS')) {
            success = true
            break
          }
          
        } catch (error) {
          lastError = error instanceof Error ? error.message : 'Неизвестная ошибка'
          continue
        }
      }
      
      if (!success) {
        throw new Error(`Не удалось запустить Python: ${lastError}`)
      }

      // Читаем сгенерированный PDF
      const pdfBuffer = await fs.readFile(outputPath)

      // Удаляем временные файлы
      try {
        await fs.unlink(tempDataFile)
        await fs.unlink(outputPath)
      } catch (cleanupError) {
        console.warn('Не удалось очистить временные файлы:', cleanupError)
      }

      // Возвращаем PDF
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          ...Object.fromEntries(headers.entries()),
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="receipt.pdf"',
        },
      })

    } catch (execError) {
      // Очистка при ошибке
      try {
        await fs.unlink(tempDataFile)
      } catch (cleanupError) {
        console.warn('Не удалось очистить временный файл:', cleanupError)
      }

      console.error('Ошибка выполнения Python скрипта:', execError)
      return NextResponse.json(
        { error: 'Ошибка при генерации PDF: ' + (execError as Error).message },
        { status: 500, headers }
      )
    }

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}