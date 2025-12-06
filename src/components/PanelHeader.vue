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
  showTabActions?: boolean
}>()

defineEmits<{
  (e: 'toggle-fullscreen'): void
  (e: 'close-panel'): void
  (e: 'update:activeTab', value: string): void
  (e: 'close-tab', value: string): void
  (e: 'toggle-pin', value: string): void
}>()
</script>

<template>
  <div class="PanelHeaderContainer">
    <header class="PanelHeader">
      <div class="TabsContainer">
        <TabHeader
          v-if="tabs && tabs.length > 0"
          :tabs="tabs"
          :active-tab="activeTab || ''"
          :show-pin-close="showTabActions"
          @update:active-tab="$emit('update:activeTab', $event)"
          @close-tab="$emit('close-tab', $event)"
          @toggle-pin="$emit('toggle-pin', $event)"
        />
      </div>

      <div class="PanelControls">
        <slot name="controls"></slot>
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
  align-items: center;
  max-height: 33px;
  background-color: #f0f0f0;
  position: relative;
}

.TabsContainer {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.TabsContainer :deep(.TabsRoot) {
  overflow: hidden;
}

.TabsContainer :deep(.TabsList) {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-right: 20px;
}

.TabsContainer :deep(.TabsList)::-webkit-scrollbar {
  display: none;
}

.PanelTitle {
  font-size: 14px;
}

.PanelControls {
  display: flex;
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
  background-color: #f0f0f0;
  position: relative;
  z-index: 1;
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
