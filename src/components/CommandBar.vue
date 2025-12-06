<script lang="ts" setup>
import { ref, computed, nextTick, watch, type Component } from 'vue'
import { Search } from 'lucide-vue-next'
import { fakeNodes, type FakeNode } from '../fake-nodes'
import { Cog, Bot, GitBranch, Globe, User, Zap, Dot } from 'lucide-vue-next'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-node', node: FakeNode): void
}>()

const searchQuery = ref('')
const selectedIndex = ref(0)
const searchInputRef = ref<HTMLInputElement>()
const selectedCategory = ref<string | null>(null)

const categories = [
  {
    id: 'AI',
    name: 'AI',
    description: 'Artificial Intelligence and ML tools',
    count: fakeNodes.filter((n) => n.category === 'AI').length,
    icon: Bot,
  },
  {
    id: 'Core',
    name: 'Core',
    description: 'HTTP requests, code execution, webhooks',
    count: fakeNodes.filter((n) => n.category === 'Core').length,
    icon: Cog,
  },
  {
    id: 'Flow',
    name: 'Flow',
    description: 'Conditional logic and loops',
    count: fakeNodes.filter((n) => n.category === 'Flow').length,
    icon: GitBranch,
  },
  {
    id: 'App',
    name: 'App',
    description: 'Third-party app integrations',
    count: fakeNodes.filter((n) => n.category === 'App').length,
    icon: Globe,
  },
  {
    id: 'Human in the loop',
    name: 'Human in the loop',
    description: 'Manual review and approval',
    count: fakeNodes.filter((n) => n.category === 'Human in the loop').length,
    icon: User,
  },
  {
    id: 'Triggers',
    name: 'Triggers',
    description: 'Workflow triggers and events',
    count: fakeNodes.filter((n) => n.category === 'Triggers').length,
    icon: Zap,
  },
]

const isSearching = computed(() => searchQuery.value.trim().length > 0)

type CategoryData = {
  id: string
  name: string
  description: string
  count: number
  icon: Component
}
type DisplayItem = { type: 'category'; data: CategoryData } | { type: 'node'; data: FakeNode }

const displayItems = computed((): DisplayItem[] => {
  if (isSearching.value) {
    const query = searchQuery.value.toLowerCase()
    return fakeNodes
      .filter(
        (node) =>
          node.name.toLowerCase().includes(query) ||
          node.description.toLowerCase().includes(query) ||
          node.category.toLowerCase().includes(query),
      )
      .map((node) => ({ type: 'node' as const, data: node }))
  }

  if (selectedCategory.value) {
    return fakeNodes
      .filter((node) => node.category === selectedCategory.value)
      .map((node) => ({ type: 'node' as const, data: node }))
  }

  return categories.map((cat) => ({ type: 'category' as const, data: cat }))
})

// This is the key fix - only handle specific navigation keys
function handleInputKeyDown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, displayItems.value.length - 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (event.key === 'Enter') {
    event.preventDefault()
    selectCurrentItem()
  } else if (event.key === 'Escape') {
    emit('close')
  }
  // For any other key (including backspace, typing, etc.), let it pass through normally
}

function selectCurrentItem() {
  const currentItem = displayItems.value[selectedIndex.value]
  if (!currentItem) return

  if (currentItem.type === 'category') {
    selectedCategory.value = currentItem.data.id
    selectedIndex.value = 0
  } else {
    emit('add-node', currentItem.data as FakeNode)
    emit('close')
  }
}

function selectCategory(categoryId: string) {
  selectedCategory.value = categoryId
  selectedIndex.value = 0
}

function selectNode(node: FakeNode) {
  emit('add-node', node)
  emit('close')
}

function resetToCategories() {
  selectedCategory.value = null
  searchQuery.value = ''
  selectedIndex.value = 0
}

// Watch for changes that should reset selection
watch([searchQuery, selectedCategory], () => {
  selectedIndex.value = 0
})

// Focus management
watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      resetToCategories()
      await nextTick()
      searchInputRef.value?.focus()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="visible" class="command-bar-overlay" @click="$emit('close')">
    <div class="command-bar" @click.stop>
      <div class="command-bar-header">
        <div class="search-container">
          <Search class="search-icon" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Add node"
            class="search-input"
            @keydown="handleInputKeyDown"
          />
        </div>
      </div>

      <div class="items-list">
        <div
          v-for="(item, index) in displayItems"
          :key="item.type === 'category' ? item.data.id : item.data.id"
          :class="['item', { selected: index === selectedIndex }]"
          @click="
            item.type === 'category'
              ? selectCategory(item.data.id)
              : selectNode(item.data as FakeNode)
          "
          @mouseenter="selectedIndex = index"
        >
          <div v-if="item.type === 'category'" class="category-item">
            <div class="category-header">
              <span class="category-icon">
                <component :is="item.data.icon" :size="20" />
              </span>
              <div class="category-info">
                <span class="category-name">{{ item.data.name }}</span>
                <span class="category-count">{{ (item.data as CategoryData).count }} nodes</span>
              </div>
            </div>
            <div class="category-description">{{ item.data.description }}</div>
          </div>

          <div v-else class="node-item">
            <div class="node-header">
              <span class="node-icon">
                <SquareX />
              </span>
              <div class="node-info">
                <span class="node-name">{{ item.data.name }}</span>
                <span class="node-category">{{ (item.data as FakeNode).category }}</span>
              </div>
            </div>
            <div class="node-description">{{ item.data.description }}</div>
          </div>
        </div>
      </div>

      <div class="command-bar-footer">
        <div class="keyboard-hints">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.command-bar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  z-index: 1000;
}

.command-bar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 600px;
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.command-bar-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  border-color: #007acc;
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
}

.items-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 4px;
}

.item:hover,
.item.selected {
  background-color: #f0f9ff;
}

.item.selected {
  background-color: #e0f2fe;
}

.category-item,
.node-item {
  width: 100%;
}

.category-header,
.node-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.category-icon,
.node-icon {
  font-size: 20px;
  min-width: 24px;
  text-align: center;
}

.category-info,
.node-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name,
.node-name {
  font-weight: 600;
  color: #333;
}

.category-count {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.node-category {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.category-description,
.node-description {
  font-size: 14px;
  color: #666;
  margin-left: 36px;
}

.command-bar-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.keyboard-hints {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}
</style>
