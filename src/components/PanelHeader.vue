<script setup lang="ts">
import { PanelRight, X, PanelBottom, Scan } from 'lucide-vue-next'
import TabHeader from './TabHeader.vue'
import type { Tab } from '../composables/useTabs'

defineProps<{
  title: string
  fullScreen: boolean
  position: 'bottom' | 'right'
  tabs?: Tab[]
  activeTab?: string
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'close-panel'): void
  (e: 'update:activeTab', value: string): void
}>()
</script>

<template>
  <div class="PanelHeaderContainer">
    <header class="PanelHeader">
      <TabHeader
        v-if="tabs && tabs.length > 0"
        :tabs="tabs"
        :active-tab="activeTab || ''"
        @update:active-tab="$emit('update:activeTab', $event)"
      />
      <div class="PanelControls">
        <button class="PanelControlButton" @click="$emit('toggle-fullscreen')">
          <PanelBottom v-if="fullScreen && position === 'bottom'" :stroke-width="1.5" :size="16" />
          <PanelRight
            v-else-if="fullScreen && position === 'right'"
            :stroke-width="1.5"
            :size="16"
          />
          <Scan :size="16" :stroke-width="1.5" v-else />
        </button>
        <button class="PanelControlButton" @click="$emit('close-panel')">
          <X :size="16" :stroke-width="1.5" />
        </button>
      </div>
    </header>
  </div>
</template>

<style scoped>
.PanelHeaderContainer {
  border-bottom: 1px solid #ccc;
}

.PanelHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;

  background-color: #f0f0f0;
}

.PanelTitle {
  font-size: 14px;
}

.PanelControls {
  display: flex;
  gap: 8px;
  padding: 8px;
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
