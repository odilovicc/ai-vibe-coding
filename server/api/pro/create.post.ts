import { createHash, createHmac } from 'crypto'

// Глобальное хранилище для invoice_id <-> userToken (MVP)
declare global {
  // eslint-disable-next-line no-var
  var invoiceUserMap: Record<string, string> | undefined;
}
const invoiceUserMap: Record<string, string> = globalThis.invoiceUserMap || (globalThis.invoiceUserMap = {});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = config.public.CRPYTO_BOT_TOKEN

  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_PUBLIC_CRYPTO_BOT_TOKEN не задан в .env' })
  }

  // Получаем userToken из тела запроса
  const body = await readBody(event)
  const userToken = body?.userToken
  if (!userToken) {
    throw createError({ statusCode: 400, statusMessage: 'userToken обязателен' })
  }

  try {
    // Создаем инвойс в Crypto Bot (тестовый endpoint)
    const response = await fetch('https://pay.crypt.bot/api/createInvoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Crypto-Pay-API-Token': token
      },
      body: JSON.stringify({
        asset: 'USDT',
        amount: '1',
        description: 'PRO доступ к сервису анализа резюме',
        paid_btn_name: 'callback',
        paid_btn_url: `${config.public.baseUrl}/pro/success?key=${userToken}`,
        allow_comments: false,
        allow_anonymous: false,
        expires_in: 3600, // 1 час
        payload: userToken
      })
    })

    // Логируем ответ для отладки
    const raw = await response.text()
    console.log('CryptoBot response:', raw)
    const data = JSON.parse(raw)
    
    if (!data.ok) {
      throw new Error(data.error || 'Ошибка создания платежа')
    }

    // Сохраняем связь invoice_id <-> userToken
    invoiceUserMap[data.result.invoice_id] = userToken

    return {
      ok: true,
      result: {
        invoice_id: data.result.invoice_id,
        pay_url: data.result.bot_invoice_url,
        expires_at: data.result.expiration_date
      }
    }
  } catch (e: any) {
    throw createError({ 
      statusCode: 500, 
      statusMessage: e.message || 'Ошибка создания платежа'
    })
  }
}) 