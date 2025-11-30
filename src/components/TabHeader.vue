<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger } from 'reka-ui'
import type { Tab } from '../composables/useTabs'

defineProps<{
  tabs: Tab[]
  activeTab: string
}>()

defineEmits<{
  (e: 'update:activeTab', value: string): void
}>()
</script>

<template>
  <TabsRoot 
    :model-value="activeTab" 
    @update:model-value="$emit('update:activeTab', $event)"
    class="TabsRoot"
  >
    <TabsList class="TabsList">
      <TabsTrigger 
        v-for="tab in tabs" 
        :key="tab.value" 
        :value="tab.value"
        class="TabsTrigger"
      >
        {{ tab.label }}
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
  border-bottom: 1px solid #e2e2e2;
  background-color: #f8f8f8;
}

.TabsTrigger {
  background: none;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.TabsTrigger[data-state="active"] {
  color: #333;
  border-bottom-color: #007acc;
  background-color: #fff;
}

.TabsTrigger:hover:not([data-state="active"]) {
  background-color: #f0f0f0;
  color: #333;
}
</style>