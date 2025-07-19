export default defineEventHandler(async (event) => {
  // 1. Получаем сообщение, которое ввел пользователь в чате
  const body = await readBody(event)
  const userMessage = body.message as string
  const agentUrl = body.agentUrl || process.env.N8N_CHAT_AGENT_URL

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
    // 3. Отправляем промпт пользователя в n8n и ждем ответа.
    // n8n должен вернуть JSON в формате { reply: "...", sources: [...] }
    const agentResponse = await $fetch<{ reply: string; sources?: string[] }>(agentUrl, {
      method: 'POST',
      // В тело запроса кладем сообщение пользователя
      body: {
        prompt: userMessage,
      },
    })

    // 4. Возвращаем ответ от n8n обратно в наш чат на фронтенде
    return agentResponse // agentResponse уже имеет вид { reply: "...", sources: [...] }
  } catch (error) {
    console.error('Ошибка при общении с агентом в n8n:', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Агент в n8n не отвечает или вернул ошибку.',
    })
  }
})
