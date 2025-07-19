<script setup lang="ts">
import { ref, computed } from "vue";

// Определяем тип (интерфейс) для объекта сообщения
interface Message {
  id: number;
  role: "user" | "agent";
  content: string;
  sources?: string[];
}

// ref() делает переменную "реактивной". Когда она изменится, Vue обновит HTML.
const messages = ref<Message[]>([
  {
    id: 1,
    role: "agent",
    content:
      "Здравствуйте! Я ваш ИИ-агент-оркестратор. Какой проект мы будем разрабатывать сегодня?",
  },
]);
const userInput = ref("");
const isLoading = ref(false);

// Асинхронная функция для отправки сообщения
async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  messages.value.push({
    id: Date.now(),
    role: "user",
    content: userInput.value,
  });

  const userMessage = userInput.value;
  userInput.value = "";
  isLoading.value = true;

  try {
    // $fetch - это встроенная в Nuxt функция для запросов к API.
    // Мы делаем POST-запрос на наш внутренний API /api/chat.
    const response = await $fetch("/api/chat", {
      method: "POST",
      body: { message: userMessage },
    });

    messages.value.push({
      id: Date.now(),
      role: "agent",
      content: response.reply,
      sources: response.sources,
    });
  } catch (error) {
    console.error("Ошибка при общении с агентом:", error);
    messages.value.push({
      id: Date.now(),
      role: "agent",
      content:
        "Произошла ошибка при обращении к серверу. Убедитесь, что сервер запущен и API-URL настроен в .env файле.",
    });
  } finally {
    isLoading.value = false;
  }
}

const lastAgentMessage = computed(() => {
  // Ищем сообщения с конца массива, чтобы найти последнее сообщение от агента
  return [...messages.value].reverse().find(m => m.role === "agent");
});
</script>

<template>
  <div class="chat-container">
    <div class="message-list">
      <!-- Пробегаемся по всем сообщениям и для каждого рендерим компонент ChatMessage -->
      <!-- Мы создадим его на следующем шаге. -->
      <div v-for="message in messages" :key="message.id">
        <ChatMessage :message="message" />
      </div>
    </div>

    <div class="input-area">
      <!-- Компонент WebhookControls мы тоже создадим. -->
      <WebhookControls :last-agent-message="lastAgentMessage" />
      <form @submit.prevent="sendMessage" class="chat-form">
        <button type="button" class="attach-btn" title="Прикрепить файл">
          📎
        </button>
        <input
          v-model="userInput"
          type="text"
          placeholder="Спросите что-нибудь у агента..."
          :disabled="isLoading"
        />
        <button type="submit" :disabled="isLoading">
          <span v-if="!isLoading">➤</span>
          <span v-else>...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* "scoped" означает, что эти стили применяются ТОЛЬКО к этому компоненту */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}
.input-area {
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}
.chat-form {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}
.chat-form input {
  flex-grow: 1;
  border: 1px solid #ccc;
  border-radius: 18px;
  padding: 8px 15px;
  font-size: 1rem;
}
.chat-form button,
.attach-btn {
  border: none;
  background: #007bff;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1.2rem;
}
.attach-btn {
  background: none;
  color: #555;
}
</style>
