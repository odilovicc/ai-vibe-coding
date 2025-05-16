import { PDFParser } from 'pdf2json'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  const profession = form?.find(f => f.name === 'profession')?.data?.toString() || 'Unknown'

  if (!file?.data) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не найден' })
  }

  // Функция извлечения текста из PDF через pdf2json
  const extractTextFromPdf = async (pdfBuffer: Buffer): Promise<string> => {
    const { default: PDFParser } = await import('pdf2json')
  
    const parser = new PDFParser()
  
    return new Promise((resolve, reject) => {
      parser.on('pdfParser_dataError', errData => reject(errData.parserError))
      parser.on('pdfParser_dataReady', pdfData => {
        const text = pdfData?.formImage?.Pages?.map((page: any) =>
          page.Texts.map((t: any) =>
            decodeURIComponent(t.R[0].T)
          ).join(' ')
        ).join('\n') || ''
        resolve(text)
      })
  
      parser.parseBuffer(pdfBuffer)
    })
  }
  

  const pdfText = await extractTextFromPdf(file.data as Buffer)

  const prompt = `
Ты — эксперт по резюме. Проанализируй это резюме для профессии "${profession}".
1. Найди ошибки (weaknesses) — список.
2. Дай советы (tips) — список.
3. Перепиши резюме под эту профессию (improved) — текст.
4. Сгенерируй HTML шаблон (html) — блок <div>...</div>.

Резюме:
${pdfText}
Ответ верни в формате JSON с полями: weaknesses, tips, improved, html.
  `.trim()

  const apiKey = process.env.NUXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'GEMINI_API_KEY не задан в .env' })
  }

  const geminiRes = await fetch(
    'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  ).then(r => r.json())

  let text = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || ''
  let json
  try {
    json = JSON.parse(text)
    return json
  } catch (e) {
    console.error('Gemini parse error:', e, text)
    return {
      error: 'Ошибка парсинга ответа Gemini',
      raw: text
    }
  }
})
