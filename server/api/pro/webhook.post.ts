import { createHash, createHmac } from 'crypto'

declare global {
  // eslint-disable-next-line no-var
  var invoiceUserMap: Record<string, string> | undefined;
  var proUsers: Record<string, boolean> | undefined;
}
const invoiceUserMap: Record<string, string> = globalThis.invoiceUserMap || (globalThis.invoiceUserMap = {});
const proUsers: Record<string, boolean> = globalThis.proUsers || (globalThis.proUsers = {});

export default defineEventHandler(async (event) => {
  const token = process.env.CRYPTO_BOT_TOKEN

  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'CRYPTO_BOT_TOKEN не задан в .env' })
  }

  try {
    const body = await readBody(event)
    const signature = getHeader(event, 'crypto-pay-api-signature')

    // Проверяем подпись
    const checkString = JSON.stringify(body)
    const hmac = createHmac('sha256', token).update(checkString).digest('hex')

    if (hmac !== signature) {
      throw new Error('Неверная подпись')
    }

    // Проверяем тип обновления
    if (body.update_type !== 'invoice_paid') {
      return { ok: true }
    }

    const invoice = body.payload

    // Проверяем статус инвойса
    if (invoice.status !== 'paid') {
      return { ok: true }
    }

    // Активируем PRO для userToken
    const userToken = invoice.payload || invoiceUserMap[invoice.invoice_id]
    if (userToken) {
      proUsers[userToken] = true
      console.log('PRO активирован для userToken:', userToken)
    }

    // TODO: Обновляем статус PRO в базе данных
    // TODO: Отправляем уведомление пользователю

    return { ok: true }
  } catch (e: any) {
    console.error('Webhook error:', e)
    throw createError({ 
      statusCode: 500, 
      statusMessage: e.message || 'Ошибка обработки webhook'
    })
  }
}) 