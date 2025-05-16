// server/api/pro-activate.post.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const key = body?.key
  
    if (!key || typeof key !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Неверный ключ' })
    }
  
    // Простая активация (в будущем — проверка оплаты)
    globalThis.proUsers = globalThis.proUsers || {}
    globalThis.proUsers[key] = true
  
    console.log('PRO выдан по ключу:', key)
  
    return { ok: true }
  })
  