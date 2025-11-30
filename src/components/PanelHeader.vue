<script setup lang="ts">
import { PanelRight, X, PanelBottom, Scan } from 'lucide-vue-next'

defineProps<{
  title: string
  fullScreen: boolean
  position: 'bottom' | 'right'
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'close-panel'): void
}>()
</script>

<template>
  <header class="PanelHeader">
    <h2 class="PanelTitle">{{ title }}</h2>
    <div class="PanelControls">
      <button class="PanelControlButton" @click="$emit('toggle-fullscreen')">
        <PanelBottom v-if="fullScreen && position === 'bottom'" :stroke-width="1.25" :size="16" />
        <PanelRight
          v-else-if="fullScreen && position === 'right'"
          :stroke-width="1.25"
          :size="16"
        />
        <Scan :size="16" :stroke-width="1.25" v-else />
      </button>
      <button class="PanelControlButton" @click="$emit('close-panel')">
        <X :size="16" :stroke-width="1.25" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.PanelHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.PanelTitle {
  font-size: 14px;
}

.PanelControls {
  display: flex;
  gap: 8px;
}

.PanelControlButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  color: grey;
}
</style>
