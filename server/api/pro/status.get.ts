import { defineEventHandler, getQuery, getHeader } from 'h3'

declare global {
  // eslint-disable-next-line no-var
  var proUsers: Record<string, boolean> | undefined;
}
const proUsers: Record<string, boolean> = globalThis.proUsers || (globalThis.proUsers = {});

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const key = query.key as string | undefined
  const userToken = query.userToken || getHeader(event, 'x-user-token')

  // Если это success страница после оплаты
  if (key && typeof key === 'string') {
    proUsers[key] = true
    console.log(`PRO успешно выдан для ключа: ${key}`)
    return {
      message: 'PRO активирован. Можете закрыть эту страницу.',
      pro: true
    }
  }

  if (!userToken || typeof userToken !== 'string') {
    return { pro: false }
  }

  return { pro: !!proUsers[userToken] }
})
