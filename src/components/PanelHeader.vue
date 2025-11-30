<script setup lang="ts">
defineProps<{
  title: string
  fullScreen: boolean
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'close-panel'): void
}>()
</script>

<template>
  <header class="PanelHeader">
    <h2>{{ title }}</h2>
    <div>
      <button @click="$emit('toggle-fullscreen')">
        {{ fullScreen ? 'Exit Fullscreen' : 'Fullscreen' }}
      </button>
      <button @click="$emit('close-panel')">Close</button>
    </div>
  </header>
</template>

<style scoped>
.PanelHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}
</style>
