<script setup lang="ts">
import type { PropType } from "vue";

interface AgentMessage {
  id: number;
  role: "agent";
  content: string;
  sources?: string[];
}

const props = defineProps({
  lastAgentMessage: {
    type: Object as PropType<AgentMessage | undefined>,
    default: undefined,
  },
});

const requestType = ref("POST");
const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const isLoading = ref(false);

async function sendWebhook(env: "test" | "prod") {
  if (!props.lastAgentMessage) {
    alert("Нечего отправлять. Сначала получите ответ от агента.");
    return;
  }

  isLoading.value = true;
  try {
    // Эта функция отправляет запрос на НАШ СОБСТВЕННЫЙ сервер (на код из Шага 2)
    const response = await $fetch("/api/webhook", {
      method: "POST",
      body: {
        env: env,
        method: requestType.value,
        payload: props.lastAgentMessage,
      },
    });
    alert(`Успешно! Ответ сервера: ${response.message}`);
  } catch (error: any) {
    // Если наш сервер вернул ошибку (например, не смог связаться с n8n),
    // мы покажем ее здесь.
    alert(`Ошибка: ${error.data.statusMessage}`);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <!-- ... ваш HTML-шаблон остается без изменений ... -->
  <div class="webhook-controls" :class="{ loading: isLoading }">
    <select v-model="requestType" :disabled="isLoading">
      <option v-for="method in httpMethods" :key="method" :value="method">
        {{ method }}
      </option>
    </select>
    <button @click="sendWebhook('test')" :disabled="isLoading">Test</button>
    <button @click="sendWebhook('prod')" :disabled="isLoading">Prod</button>
  </div>
</template>

<style scoped>
.webhook-controls {
  display: flex;
  gap: 10px;
}
.webhook-controls.loading {
  opacity: 0.5;
}
</style>
