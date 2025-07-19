<script setup lang="ts">
// Определяем, какие "пропсы" (свойства) компонент принимает извне
defineProps<{
  message: {
    role: "user" | "agent";
    content: string;
    sources?: string[];
  };
}>();
</script>

<template>
  <div class="message-wrapper" :class="`role-${message.role}`">
    <div class="message-bubble">
      <p>{{ message.content }}</p>
      <!-- Показываем источники, если они есть -->
      <div v-if="message.sources && message.sources.length > 0" class="sources">
        <strong>Источники:</strong>
        <ul>
          <li v-for="source in message.sources" :key="source">
            <a :href="source" target="_blank">{{ source }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 1rem;
}
.role-user {
  justify-content: flex-end;
}
.role-agent {
  justify-content: flex-start;
}
.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
}
.role-user .message-bubble {
  background-color: #007bff;
  color: white;
}
.role-agent .message-bubble {
  background-color: #e9e9eb;
  color: black;
}
p {
  margin: 0;
}
.sources {
  margin-top: 10px;
  font-size: 0.8rem;
}
</style>
