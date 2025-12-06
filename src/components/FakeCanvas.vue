<script lang="ts" setup>
import {
  Bot,
  Globe,
  MinusIcon,
  PanelBottom,
  PanelRight,
  PlusIcon,
  Sparkles,
  Zap,
  Pen,
  GitBranch,
  ToolCase,
  UserCheck,
  StickyNote,
  Search,
  Eye,
} from 'lucide-vue-next'
import ReusableDropdown from './ReusableDropdown.vue'

interface FakeNode {
  id: string
  name: string
  params: Record<string, { type: string; value: string }>
}

defineProps<{
  nodes: FakeNode[]
}>()

const emit = defineEmits<{
  (e: 'node-dblclick', nodeId: string): void
  (e: 'node-click', nodeId: string): void
  (e: 'left-drawer-toggle'): void
  (e: 'right-drawer-toggle'): void
  (e: 'bottom-drawer-toggle'): void
}>()

let clickTimer: ReturnType<typeof setTimeout> | null = null

function handleClick(nodeId: string) {
  if (clickTimer) {
    clearTimeout(clickTimer)
    clickTimer = null
    return
  }

  clickTimer = setTimeout(() => {
    emit('node-click', nodeId)
    clickTimer = null
  }, 50)
}

function handleDoubleClick(nodeId: string) {
  if (clickTimer) {
    clearTimeout(clickTimer)
    clickTimer = null
  }
  emit('node-dblclick', nodeId)
}
</script>

<template>
  <div class="FakeNodesContainer">
    <aside class="TopLeft Controls">
      <button class="ControlButton" @click="$emit('left-drawer-toggle')">
        <Sparkles />
      </button>
    </aside>
    <aside class="TopRight Controls">
      <button class="ControlButton" @click="$emit('right-drawer-toggle')">
        <PanelRight />
      </button>
    </aside>
    <aside class="Bottom Controls">
      <div class="ControlGroup">
        <PlusIcon />
        <p>50%</p>
        <MinusIcon />
        <span class="Divider" />
        <ReusableDropdown
          trigger-label="View options"
          no-search
          :items="[
            { id: 'heat-map', label: 'Heatmap' },
            { id: 'tidy', label: 'Tidy up' },
            { id: 'reset', label: 'Reset' },
          ]"
        >
          <Eye />
        </ReusableDropdown>
      </div>
      <div class="ControlGroup">
        <button class="ExecuteButton" @click="$emit('bottom-drawer-toggle')">
          Execute workflow
        </button>
        <span class="Divider" />
        <Zap />
        <Bot />
        <Globe />
        <Pen />
        <GitBranch />
        <ToolCase />
        <UserCheck />
        <StickyNote />
        <span class="Divider" />
        <Search />
      </div>
      <button class="ControlButton" @click="$emit('bottom-drawer-toggle')">
        <PanelBottom />
      </button>
    </aside>
    <div
      @dblclick="handleDoubleClick(node.id)"
      @click="handleClick(node.id)"
      v-for="node in nodes"
      :key="node.id"
      class="FakeNode"
    >
      <h3>{{ node.name }}</h3>
    </div>
  </div>
</template>

<style scoped>
.FakeNodesContainer {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #eee;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  overflow: auto;
  position: relative;
}

.FakeNode {
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  text-align: center;
}

.Controls {
  position: absolute;
  display: flex;
  gap: 8px;
  padding: 8px;
}

.TopLeft {
  top: 0;
  left: 0;
}

.TopRight {
  top: 0;
  right: 0;
}

.Bottom {
  bottom: 0;
  width: 100%;
  justify-content: space-between;
}

.ControlButton {
  background: #fff;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ControlGroup {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 4px 8px;
}

.Divider {
  width: 1px;
  height: 20px;
  background-color: #ccc;
  margin: 0 8px;
}

.ControlGroup svg {
  width: 20px;
}

.ExecuteButton {
  background-color: #d46e00;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
