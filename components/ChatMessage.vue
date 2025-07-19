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
      <div class="message-header">
        <div class="avatar" :class="`avatar-${message.role}`">
          <svg v-if="message.role === 'user'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="message-content">
          <p>{{ message.content }}</p>
          <!-- Показываем источники, если они есть -->
          <div v-if="message.sources && message.sources.length > 0" class="sources">
            <div class="sources-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <span>Источники</span>
            </div>
            <div class="sources-list">
              <a 
                v-for="source in message.sources" 
                :key="source" 
                :href="source" 
                target="_blank"
                class="source-link"
              >
                {{ source }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-wrapper {
  display: flex;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease-out;
}

.role-user {
  justify-content: flex-end;
}

.role-agent {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 85%;
  min-width: 200px;
  position: relative;
}

.message-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;
}

.avatar-user {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.avatar-agent {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.message-content {
  flex-grow: 1;
  min-width: 0;
}

.message-content p {
  margin: 0 0 12px 0;
  line-height: 1.6;
  color: #333;
  font-size: 15px;
}

.role-user .message-content p {
  color: white;
}

.role-user .message-bubble {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 20px 20px 4px 20px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.role-agent .message-bubble {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.1);
  color: #333;
  border-radius: 20px 20px 20px 4px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Sources */
.sources {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.role-agent .sources {
  border-top-color: rgba(102, 126, 234, 0.1);
}

.sources-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.source-link {
  color: inherit;
  text-decoration: none;
  font-size: 13px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.2s ease;
  word-break: break-all;
  display: block;
}

.role-agent .source-link {
  background: rgba(102, 126, 234, 0.05);
  color: #667eea;
}

.source-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(2px);
}

.role-agent .source-link:hover {
  background: rgba(102, 126, 234, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 90%;
    min-width: 150px;
  }
  
  .message-content p {
    font-size: 14px;
  }
  
  .avatar {
    width: 28px;
    height: 28px;
  }
  
  .message-bubble {
    padding: 12px 16px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
