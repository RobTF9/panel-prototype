<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const props = defineProps<{
  items: DropdownItem[]
  triggerLabel: string
  noSearch?: boolean
  flattenedItems?: Array<{ id: string; label: string; nodeId?: string; paramId?: string }>
}>()

const searchValue = ref('')
const searchInputRef = ref<HTMLInputElement>()
const selectedIndex = ref(-1)
const isOpen = ref(false)

const emit = defineEmits<{
  (e: 'item-click', itemId: string, subItemId?: string): void
  (e: 'search', query: string): void
}>()

// Compute all selectable items
const selectableItems = computed(() => {
  if (searchValue.value && props.flattenedItems) {
    return props.flattenedItems
  }

  const items: Array<{ id: string; label: string; nodeId?: string; paramId?: string }> = []
  props.items.forEach((item) => {
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        items.push({
          id: child.id,
          label: child.label,
          nodeId: item.id,
          paramId: child.id,
        })
      })
    } else {
      items.push({
        id: item.id,
        label: item.label,
        nodeId: item.id,
      })
    }
  })
  return items
})

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchValue.value = target.value
  selectedIndex.value = -1 // Reset selection
  emit('search', target.value)
}

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  console.log('Global keydown:', event.key)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) return
    selectedIndex.value = (selectedIndex.value + 1) % selectableItems.value.length
    return
  }

  if (event.key === 'ArrowRight' || event.key === 'Enter') {
    event.preventDefault()
    if (!isOpen.value) return
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    if (!isOpen.value) return
    isOpen.value = false
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) return
    selectedIndex.value =
      (selectedIndex.value - 1 + selectableItems.value.length) % selectableItems.value.length
    return
  }

  if (event.key === 'Backspace') {
    event.preventDefault()
    if (!isOpen.value) return
    searchValue.value = searchValue.value.slice(0, -1)
    return
  }
  searchValue.value = searchValue.value + event.key || ''
  if (!isOpen.value) return

  console.log('Not open:', event.key)
}

const handleOpenChange = (open: boolean) => {
  isOpen.value = open
  if (open) {
    selectedIndex.value = -1
    // Auto-focus search input
    setTimeout(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    }, 50)
  } else {
    searchValue.value = ''
    emit('search', '')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <DropdownMenuRoot @open-change="handleOpenChange">
    <DropdownMenuTrigger as-child>
      <button class="dropdown-trigger">
        <slot>
          {{ props.triggerLabel }}
        </slot>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent class="dropdown-content" :side-offset="5">
        <div v-if="!noSearch" class="search-container">
          <input
            ref="searchInputRef"
            type="text"
            v-model="searchValue"
            @input="handleSearchInput"
            @keydown.stop
            placeholder="Search..."
            class="search-input"
          />
        </div>

        <!-- Show flattened items when searching -->
        <template v-if="searchValue && props.flattenedItems">
          <DropdownMenuItem
            v-for="(item, index) in props.flattenedItems"
            :key="item.id"
            :class="['dropdown-item', { 'dropdown-item-selected': selectedIndex === index }]"
            @click="emit('item-click', item.nodeId || item.id, item.paramId)"
          >
            {{ item.label }}
          </DropdownMenuItem>
        </template>

        <!-- Show hierarchical items when not searching -->
        <template v-else>
          <template v-for="item in props.items" :key="item.id">
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
                    @click="emit('item-click', item.id, subItem.id)"
                  >
                    {{ subItem.label }}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem v-else class="dropdown-item" @click="emit('item-click', item.id)">
              {{ item.label }}
            </DropdownMenuItem>
          </template>
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
  color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
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

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: #f0f0f0;
}

.dropdown-item-selected {
  background-color: #007acc !important;
  color: white;
}

.dropdown-sub-trigger::after {
  content: '›';
  margin-left: auto;
  font-size: 12px;
}

.search-container {
  border-bottom: 1px solid #eee;
  margin-bottom: 4px;
}

.search-input {
  width: 100%;
  padding: 6px 8px;
  border: none;
  border-radius: 2px;
  font-size: 14px;
  outline: none;
}

.search-input:focus {
  border-color: #007acc;
}
</style>
