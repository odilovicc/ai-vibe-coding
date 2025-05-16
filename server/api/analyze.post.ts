import pdf from 'pdf-parse'

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  const profession = form?.find(f => f.name === 'profession')?.data?.toString() || 'Unknown'

  if (!file?.data) {
    throw createError({ statusCode: 400, statusMessage: 'Файл не найден' })
  }

  // 1. Извлекаем текст из PDF
  const pdfText = await pdf(file.data).then((data: any) => data.text)

  // 2. Формируем промпт для Gemini
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

  // 3. Запрос к Gemini
  const apiKey = process.env.GEMINI_API_KEY
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

  // 4. Парсим ответ Gemini
  let text = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || ''
  let json
  try {
    json = JSON.parse(text)
    return json
  } catch (e) {
    // Если не удалось распарсить — возвращаем как есть, чтобы фронт мог показать пользователю
    console.error('Gemini parse error:', e, text)
    return {
      error: 'Ошибка парсинга ответа Gemini',
      raw: text
    }
  }
})