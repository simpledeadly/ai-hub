export default defineEventHandler(async event => {
  // Получаем данные, которые пришли от кнопок на сайте
  const body = await readBody(event);
  const { env, method, payload } = body;

  // Выбираем ПРАВИЛЬНЫЙ адрес для n8n в зависимости от нажатой кнопки
  // Он берет этот адрес из файла .env, который мы исправили на шаге 1
  const webhookUrl =
    env === "test"
      ? process.env.N8N_TEST_WEBHOOK_URL
      : process.env.N8N_PROD_WEBHOOK_URL;

  // Если адрес в .env не был найден, выдаем понятную ошибку
  if (!webhookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: `URL для '${env}' вебхука не настроен на сервере.`,
    });
  }

  // Этот блок кода пытается связаться с n8n
  try {
    // Вот здесь происходит тот самый запрос к n8n (например, на http://localhost:5678/webhook-test/api)
    // Если n8n выключен или адрес неправильный, здесь и возникает ошибка
    await $fetch(webhookUrl, {
      method: "POST", // Вебхуки n8n всегда вызываются методом POST
      body: {
        // Это те данные, которые вы увидите в n8n
        requestMethod: method, // Метод, который вы выбрали в интерфейсе (GET, POST и т.д.)
        data: payload, // Сообщение от ИИ-агента
      },
    });

    // Если все прошло хорошо, отправляем на сайт ответ об успехе
    return { message: "Вебхук n8n успешно вызван!" };
  } catch (error) {
    // Если связаться с n8n не удалось, вы увидите эту ошибку
    console.error("Ошибка при вызове вебхука n8n:", error);
    throw createError({
      statusCode: 502,
      // Вот это сообщение вы и видели:
      statusMessage: "Не удалось связаться с сервисом n8n.",
    });
  }
});
