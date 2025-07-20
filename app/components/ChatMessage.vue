<script setup lang="ts">
const props = defineProps<{
  message: {
    role: 'user' | 'agent'
    content: string
    sources?: string[]
  }
}>()
</script>

<template>
  <div>
    <div>
      <div>
        <p>
          {{ props.message.content }}
        </p>

        <div v-if="props.message.sources && props.message.sources.length > 0">
          <div>
            <span class="sources-title">Источники</span>
          </div>

          <div>
            <a
              v-for="source in props.message.sources"
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
</template>

<style lang="scss">
/** keep */
</style>
