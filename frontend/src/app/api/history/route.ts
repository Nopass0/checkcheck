import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface HistoryItem {
  filename: string
  timestamp: string
  data: any
  size: number
}

// Очистка старых файлов (старше месяца)
async function cleanupOldFiles(generatedDir: string) {
  try {
    const files = await fs.readdir(generatedDir)
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(generatedDir, file)
        const stat = await fs.stat(filePath)
        
        if (stat.mtime < oneMonthAgo) {
          // Удаляем метаданные и соответствующий PDF
          const pdfFile = file.replace('.json', '')
          const pdfPath = path.join(generatedDir, pdfFile)
          
          await fs.unlink(filePath).catch(() => {})
          await fs.unlink(pdfPath).catch(() => {})
        }
      }
    }
  } catch (error) {
    console.warn('Ошибка при очистке старых файлов:', error)
  }
}

export async function GET() {
  try {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    const generatedDir = path.join(process.cwd(), '..', 'generated_pdfs')
    
    // Создаем папку если не существует
    try {
      await fs.access(generatedDir)
    } catch {
      await fs.mkdir(generatedDir, { recursive: true })
    }

    // Очищаем старые файлы
    await cleanupOldFiles(generatedDir)

    // Читаем все файлы метаданных
    const files = await fs.readdir(generatedDir)
    const metadataFiles = files.filter(file => file.endsWith('.json'))
    
    const history: HistoryItem[] = []
    
    for (const metadataFile of metadataFiles) {
      try {
        const filePath = path.join(generatedDir, metadataFile)
        const content = await fs.readFile(filePath, 'utf-8')
        const metadata = JSON.parse(content)
        history.push(metadata)
      } catch (error) {
        console.warn(`Ошибка чтения метаданных ${metadataFile}:`, error)
      }
    }

    // Сортируем по дате (новые сначала)
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ history }, { headers })

  } catch (error) {
    console.error('Ошибка получения истории:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении истории' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
