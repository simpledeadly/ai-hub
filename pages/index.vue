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
    <!-- Header -->
    <div class="chat-header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">🤖</div>
          <h1 class="text-gradient">AI Hub</h1>
        </div>
        <div class="header-subtitle">Интеллектуальный помощник для разработки</div>
      </div>
    </div>

    <!-- Messages -->
    <div class="message-list">
      <div v-for="message in messages" :key="message.id" class="message-wrapper fade-in">
        <ChatMessage :message="message" />
      </div>
      
      <!-- Loading indicator -->
      <div v-if="isLoading" class="loading-message">
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <span>Агент думает...</span>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
      <form @submit.prevent="sendMessage" class="chat-form">
        <div class="input-container">
          <button type="button" class="attach-btn" title="Прикрепить файл">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <input
            v-model="userInput"
            type="text"
            placeholder="Спросите что-нибудь у агента..."
            :disabled="isLoading"
            class="chat-input"
          />
          <button type="submit" :disabled="isLoading" class="send-btn">
            <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
            <div v-else class="loading-spinner"></div>
          </button>
        </div>
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
  background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%);
}

/* Header */
.chat-header {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.header-content {
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-subtitle {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* Messages */
.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px 32px;
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 100%);
}

.message-wrapper {
  margin-bottom: 24px;
}

/* Loading */
.loading-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  max-width: 300px;
  margin: 0 auto;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: pulse 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

.loading-message span {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

/* Input Area */
.input-area {
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.chat-form {
  margin-top: 16px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 24px;
  padding: 8px;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.chat-input {
  flex-grow: 1;
  border: none;
  background: transparent;
  padding: 12px 16px;
  font-size: 16px;
  color: #333;
  outline: none;
}

.chat-input::placeholder {
  color: #999;
}

.attach-btn {
  border: none;
  background: transparent;
  color: #667eea;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.attach-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.send-btn {
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .chat-header {
    padding: 16px 20px;
  }
  
  .message-list {
    padding: 16px 20px;
  }
  
  .input-area {
    padding: 16px 20px;
  }
  
  .logo h1 {
    font-size: 24px;
  }
}
</style>
