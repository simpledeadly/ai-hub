import type { ServerResponse } from '@@/middlewares/types/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userMessage = body.message as string
  const agentUrl = body.agentUrl as string

  if (!userMessage) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Сообщение не может быть пустым',
    })
  }

  if (!agentUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'URL агента не настроен',
    })
  }

  console.log(`Отправляем промпт в n8n (${agentUrl}): "${userMessage}"`)

  try {
    const agentResponse = await $fetch<ServerResponse>(agentUrl, {
      method: 'POST',
      body: {
        prompt: userMessage,
      },
    })

    return agentResponse
  } catch (error) {
    console.error('Ошибка при общении с агентом в n8n:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Агент в n8n не отвечает или вернул ошибку.',
    })
  }
})
