<script setup lang="ts">
import { MoreVertical } from 'lucide-vue-next'
import { ref } from 'vue'

interface NodeAction {
  id: string
  label: string
  children?: NodeAction[]
}

const props = defineProps<{
  nodeId: string
  nodeName: string
  nodeParams: Record<string, { type: string; value: string }>
}>()

const emit = defineEmits<{
  (e: 'action-click', action: string, nodeId: string, paramKey?: string): void
}>()

const showMenu = ref(false)

const actions: NodeAction[] = [
  { id: 'execute', label: 'Execute' },
  { id: 'copy', label: 'Copy' },
  { id: 'open', label: 'Open' },
  { id: 'replace', label: 'Replace' },
  { 
    id: 'parameters', 
    label: 'Parameters',
    children: Object.keys(props.nodeParams).map(key => ({
      id: `param-${key}`,
      label: key
    }))
  }
]

function handleActionClick(action: NodeAction, event: Event) {
  event.stopPropagation()
  
  if (action.id.startsWith('param-')) {
    const paramKey = action.id.replace('param-', '')
    emit('action-click', 'parameter', props.nodeId, paramKey)
  } else {
    emit('action-click', action.id, props.nodeId)
  }
  
  showMenu.value = false
}

function toggleMenu(event: Event) {
  event.stopPropagation()
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}
</script>

<template>
  <div class="node-actions" @click.stop>
    <button 
      class="menu-button"
      @click="toggleMenu"
      :class="{ active: showMenu }"
    >
      <MoreVertical :size="16" />
    </button>
    
    <div v-if="showMenu" class="dropdown-menu" @click.stop>
      <template v-for="action in actions" :key="action.id">
        <!-- Action without children -->
        <button 
          v-if="!action.children"
          class="dropdown-item"
          @click="handleActionClick(action, $event)"
        >
          {{ action.label }}
        </button>
        
        <!-- Action with children (submenu) -->
        <div v-else class="dropdown-submenu">
          <div class="dropdown-item submenu-trigger">
            {{ action.label }}
            <span class="submenu-arrow">›</span>
          </div>
          <div class="submenu-content">
            <button
              v-for="child in action.children"
              :key="child.id"
              class="dropdown-item"
              @click="handleActionClick(child, $event)"
            >
              {{ child.label }}
            </button>
          </div>
        </div>
      </template>
    </div>
    
    <!-- Overlay to close menu when clicking outside -->
    <div v-if="showMenu" class="menu-overlay" @click="closeMenu"></div>
  </div>
</template>

<style scoped>
.node-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 10;
}

.menu-button {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.node-actions:hover .menu-button,
.menu-button.active {
  opacity: 1;
}

.menu-button:hover {
  background: white;
  border-color: #007acc;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 20;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.15s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-submenu {
  position: relative;
}

.submenu-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu-arrow {
  color: #666;
  font-size: 12px;
}

.dropdown-submenu:hover .submenu-content {
  display: block;
}

.submenu-content {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 30;
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>