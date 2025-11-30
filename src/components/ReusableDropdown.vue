<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from 'reka-ui'

export interface DropdownItem {
  id: string
  label: string
  children?: DropdownSubItem[]
}

export interface DropdownSubItem {
  id: string
  label: string
}

defineProps<{
  items: DropdownItem[]
  triggerLabel: string
}>()

defineEmits<{
  (e: 'item-click', itemId: string, subItemId?: string): void
}>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <button class="dropdown-trigger">
        <slot>
          {{ triggerLabel }}
        </slot>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="dropdown-content" :side-offset="5">
        <template v-for="item in items" :key="item.id">
          <DropdownMenuSub v-if="item.children && item.children.length > 0">
            <DropdownMenuSubTrigger class="dropdown-item dropdown-sub-trigger">
              {{ item.label }}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal class="dropdown-content">
              <DropdownMenuSubContent class="dropdown-content">
                <DropdownMenuItem
                  v-for="subItem in item.children"
                  :key="subItem.id"
                  class="dropdown-item"
                  @click="$emit('item-click', item.id, subItem.id)"
                >
                  {{ subItem.label }}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem v-else class="dropdown-item" @click="$emit('item-click', item.id)">
            {{ item.label }}
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
.dropdown-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  color: grey;
}

.dropdown-trigger:hover {
  background-color: #f0f0f0;
}

.dropdown-content {
  background-color: white;
  border: 1px solid grey;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  border-radius: 2px;
  outline: none;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-sub-trigger::after {
  content: '›';
  margin-left: auto;
  font-size: 12px;
}
</style>
