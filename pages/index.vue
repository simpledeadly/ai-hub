<script setup lang="ts">
import { ref } from 'vue'
import ChatMessage from '@/components/ChatMessage.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ServerResponse } from '~/middlewares/types/types'
import { Send } from 'lucide-vue-next'

type Message = {
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

const sendMessage = async () => {
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
    const agentUrl = localStorage.getItem('api-url') || ''

    const response = await $fetch<ServerResponse>('/api/chat', {
      method: 'POST',
      body: { message: userMessage, agentUrl },
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
          size="icon"
          class="shrink-0"
          :disabled="isLoading"
        >
          <Send />
        </Button>
      </form>
    </footer>
  </div>
</template>
