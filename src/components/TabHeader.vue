<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger } from 'reka-ui'
import { X, Pin } from 'lucide-vue-next'
import type { Tab } from '../composables/useTabs'

defineProps<{
  tabs: Tab[]
  activeTab: string
  showPinClose?: boolean
}>()

defineEmits<{
  (e: 'update:activeTab', value: string): void
  (e: 'close-tab', value: string): void
  (e: 'toggle-pin', value: string): void
}>()
</script>

<template>
  <TabsRoot
    :model-value="activeTab"
    @update:model-value="$emit('update:activeTab', $event)"
    class="TabsRoot"
  >
    <TabsList class="TabsList">
      <TabsTrigger v-for="tab in tabs" :key="tab.value" :value="tab.value" class="TabsTrigger">
        <span class="TabLabel">{{ tab.label }}</span>
        <div v-if="showPinClose" class="TabActions">
          <button
            class="TabActionButton PinButton"
            :class="{ 'is-pinned': tab.isPinned }"
            @click.stop="$emit('toggle-pin', tab.value)"
            :title="tab.isPinned ? 'Unpin tab' : 'Pin tab'"
          >
            <Pin :size="12" />
          </button>
          <button
            class="TabActionButton CloseButton"
            @click.stop="$emit('close-tab', tab.value)"
            title="Close tab"
          >
            <X :size="12" />
          </button>
        </div>
      </TabsTrigger>
    </TabsList>
  </TabsRoot>
</template>

<style scoped>
.TabsRoot {
  display: flex;
  flex-direction: column;
}

.TabsList {
  display: flex;
  flex-shrink: 0;
}

.TabsTrigger {
  background: none;
  border: none;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.TabsTrigger[data-state='active'] {
  color: #333;
  border-bottom-color: #007acc;
  background-color: #fff;
}

.TabsTrigger:hover:not([data-state='active']) {
  background-color: #f0f0f0;
  color: #333;
}

.TabLabel {
  flex: 1;
  text-align: left;
}

.TabActions {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  display: none;
  align-items: center;
  gap: 2px;
  background: inherit;
  padding: 2px;
  border-radius: 2px;
}

.TabsTrigger:hover .TabActions {
  display: flex;
}

.TabActionButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: #666;
}

.TabActionButton:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
}

.PinButton.is-pinned {
  color: #007acc;
}

.CloseButton:hover {
  color: #dc3545;
}
</style>
