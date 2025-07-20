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
  <div>
    <!-- Header -->
    <header>
      <div>
        <div>
          <span>🤖</span>
          <h1>AI Hub</h1>
        </div>
        <p>Интеллектуальный помощник для разработки</p>
      </div>
    </header>

    <!-- Messages -->
    <main class="messages">
      <div class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
        >
          <ChatMessage :message="message" />
          <div class="flex items-center space-x-2">
            <Checkbox />
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading">
          <span class="loading-text">Агент думает...</span>
        </div>
      </div>
    </main>

    <!-- Input Area -->
    <footer>
      <form @submit.prevent="sendMessage">
        <Input
          v-model="userInput"
          :disabled="isLoading"
          placeholder="Спросите что-нибудь у агента..."
        />
        <Button
          type="submit"
          size="icon"
          :disabled="isLoading"
        >
          <Send />
        </Button>
      </form>
    </footer>
  </div>
</template>

<style lang="scss">
/** keep */
</style>
