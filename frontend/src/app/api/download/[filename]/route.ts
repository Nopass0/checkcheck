import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })

    const filename = params.filename
    
    // Проверяем безопасность имени файла
    if (!filename || filename.includes('..') || !filename.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Недопустимое имя файла' },
        { status: 400, headers }
      )
    }

    const filePath = path.join(process.cwd(), '..', 'generated_pdfs', filename)
    
    try {
      const pdfBuffer = await fs.readFile(filePath)
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          ...Object.fromEntries(headers.entries()),
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
      
    } catch (error) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 404, headers }
      )
    }

  } catch (error) {
    console.error('Ошибка скачивания файла:', error)
    return NextResponse.json(
      { error: 'Ошибка при скачивании файла' },
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
