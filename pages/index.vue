<script setup lang="ts">
import { ref, computed } from 'vue'
import ChatMessage from '@/components/ChatMessage.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Тип сообщения
interface Message {
  id: number
  role: 'user' | 'agent'
  content: string
  sources?: string[]
}

const messages = ref<Message[]>([
  {
    id: 1,
    role: 'agent',
    content:
      'Здравствуйте! Я ваш ИИ-агент-оркестратор. Какой проект мы будем разрабатывать сегодня?',
  },
])
const userInput = ref('')
const isLoading = ref(false)

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: userInput.value,
  })

  const userMessage = userInput.value
  userInput.value = ''
  isLoading.value = true

  try {
    // Получаем URL из localStorage
    const agentUrl = localStorage.getItem('api-url') || ''

    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: { message: userMessage, agentUrl }, // <--- добавили agentUrl
    })

    messages.value.push({
      id: Date.now(),
      role: 'agent',
      content: response.reply,
      sources: response.sources,
    })
  } catch (error) {
    messages.value.push({
      id: Date.now(),
      role: 'agent',
      content:
        'Произошла ошибка при обращении к серверу. Убедитесь, что сервер запущен и API-URL настроен в настройках.',
    })
  } finally {
    isLoading.value = false
  }
}

const lastAgentMessage = computed(() => {
  return [...messages.value].reverse().find((m) => m.role === 'agent')
})
</script>

<template>
  <div class="flex flex-col h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card/80 backdrop-blur px-4 py-6">
      <div class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-2">
          <span class="text-3xl">🤖</span>
          <h1
            class="text-2xl font-bold bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent"
          >
            AI Hub
          </h1>
        </div>
        <span class="text-muted-foreground text-sm">Интеллектуальный помощник для разработки</span>
      </div>
    </header>

    <!-- Messages -->
    <main class="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
      >
        <ChatMessage :message="message" />
      </div>
      <div
        v-if="isLoading"
        class="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border w-fit mx-auto"
      >
        <span class="flex gap-1">
          <span
            class="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse"
          ></span>
          <span
            class="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse delay-150"
          ></span>
          <span
            class="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse delay-300"
          ></span>
        </span>
        <span class="text-muted-foreground text-sm">Агент думает...</span>
      </div>
    </main>

    <!-- Input Area -->
    <footer class="border-t bg-card/80 backdrop-blur px-4 py-4">
      <form
        @submit.prevent="sendMessage"
        class="flex gap-2"
      >
        <Input
          v-model="userInput"
          :disabled="isLoading"
          placeholder="Спросите что-нибудь у агента..."
          class="flex-1"
        />
        <Button
          type="submit"
          :disabled="isLoading"
          class="shrink-0"
        >
          <svg
            v-if="!isLoading"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line
              x1="22"
              y1="2"
              x2="11"
              y2="13"
            />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
          <span
            v-else
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></span>
        </Button>
      </form>
    </footer>
  </div>
</template>
