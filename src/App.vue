<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { ref, computed } from 'vue'
import PanelHeader from './components/PanelHeader.vue'
import { useEditorPanels } from './composables/useEditorPanels'
import { useTabs } from './composables/useTabs'
import FakeNodes from './components/FakeNodes.vue'
import ReusableDropdown from './components/ReusableDropdown.vue'
import type { DropdownItem } from './components/ReusableDropdown.vue'
import { Plus } from 'lucide-vue-next'

const assistantRef = ref<InstanceType<typeof SplitterPanel>>()
const canvasRef = ref<InstanceType<typeof SplitterPanel>>()
const ndvRef = ref<InstanceType<typeof SplitterPanel>>()
const footerRef = ref<InstanceType<typeof SplitterPanel>>()

const {
  panelStates,
  togglePanelVisibility,
  currentFullScreenPanel,
  toggleFullScreen,
  resetPanels,
} = useEditorPanels({
  canvasRef,
  ndvRef,
  footerRef,
})

// Node click handlers
const handleNodeClick = (nodeId: string) => {
  const node = nodes.value.find((n) => n.id === nodeId)
  if (!node) return

  const tabValue = `node-${nodeId}`
  const tabLabel = node.name

  if (ndvTabs.hasTab(tabValue)) {
    // Switch to existing tab
    ndvTabs.setActiveTab(tabValue)
  } else {
    // Add new tab
    ndvTabs.addTab({ value: tabValue, label: tabLabel })
  }

  // Show NDV panel if hidden
  if (!panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
}

const handleNodeDoubleClick = (nodeId: string) => {
  const node = nodes.value.find((n) => n.id === nodeId)
  if (!node) return

  const tabValue = `node-${nodeId}`
  const tabLabel = node.name

  if (ndvTabs.hasTab(tabValue)) {
    // Switch to existing tab
    ndvTabs.setActiveTab(tabValue)
  } else {
    // Add new tab
    ndvTabs.addTab({ value: tabValue, label: tabLabel })
  }

  // Show NDV panel and make it fullscreen
  if (!panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
  if (currentFullScreenPanel.value !== 'ndv') {
    toggleFullScreen('ndv')
  }
}

interface FakeNode {
  id: string
  name: string
  params: Record<string, { type: string; value: string }>
}

const nodes = ref<FakeNode[]>([
  {
    id: '1',
    name: 'Trigger',
    params: {
      channel: { type: 'string', value: '1234' },
    },
  },
  {
    id: '2',
    name: 'Agent',
    params: {
      systemPrompt: { type: 'string', value: 'You are a helpful assistant.' },
      userPrompt: { type: 'string', value: 'Help me with my tasks.' },
    },
  },
  {
    id: '3',
    name: 'Code',
    params: {
      javaScript: { type: 'string', value: 'console.log("Hello, world!");' },
    },
  },
])

// Setup tabs for NDV panel (start empty)
const ndvTabs = useTabs({})

// Setup tabs for footer panel
const footerTabs = useTabs({
  tabs: [
    { value: 'Executions', label: 'Executions' },
    { value: 'Evaluations', label: 'Evaluations' },
    { value: 'Data tables', label: 'Data tables' },
    { value: 'Variable', label: 'Variable' },
    { value: 'Issues', label: 'Issues' },
  ],
  defaultValue: 'tab1',
})

// Create dropdown items from nodes
const dropdownItems = computed<DropdownItem[]>(() => {
  return nodes.value.map((node) => ({
    id: node.id,
    label: node.name,
    children: Object.entries(node.params).map(([key]) => ({
      id: key,
      label: key,
    })),
  }))
})

// Handle dropdown item clicks
const handleDropdownItemClick = (nodeId: string, paramKey?: string) => {
  const node = nodes.value.find((n) => n.id === nodeId)
  if (!node) return

  let tabValue: string
  let tabLabel: string

  if (paramKey) {
    // Param clicked - format: NodeName / ParamKey
    tabValue = `node-${nodeId}-param-${paramKey}`
    tabLabel = `${node.name} / ${paramKey}`
  } else {
    // Node clicked - add/open node tab
    tabValue = `node-${nodeId}`
    tabLabel = node.name
  }

  if (ndvTabs.hasTab(tabValue)) {
    // Switch to existing tab
    ndvTabs.setActiveTab(tabValue)
  } else {
    // Add new tab
    ndvTabs.addTab({ value: tabValue, label: tabLabel })
  }

  // Show NDV panel if hidden
  if (!panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
}
</script>

<template>
  <div class="wrapper">
    <nav class="nav"></nav>
    <main class="main">
      <header class="header">
        <button @click="toggleFullScreen('canvas')">Canvas</button>
        <button @click="toggleFullScreen('ndv')">NDV</button>
        <button @click="toggleFullScreen('footer')">Footer</button>
        <button @click="resetPanels()">Reset</button>
      </header>
      <SplitterGroup auto-save-id="editor-1" direction="horizontal">
        <SplitterPanel
          ref="assistantRef"
          id="assistant"
          :max-size="40"
          :default-size="20"
          collapsible
          :min-size="15"
          >Assistant</SplitterPanel
        >
        <SplitterResizeHandle class="handle" />
        <SplitterPanel>
          <SplitterGroup auto-save-id="editor-2" direction="vertical">
            <SplitterPanel>
              <SplitterGroup auto-save-id="editor-3" direction="horizontal">
                <SplitterPanel :default-size="66" id="canvas" ref="canvasRef" collapsible>
                  <FakeNodes
                    :nodes="nodes"
                    @node-click="handleNodeClick"
                    @node-dblclick="handleNodeDoubleClick"
                  />
                </SplitterPanel>
                <SplitterResizeHandle v-if="!currentFullScreenPanel" class="handle" />
                <SplitterPanel
                  v-if="panelStates.ndv.isVisible && ndvTabs.tabs.value.length > 0"
                  id="ndv"
                  ref="ndvRef"
                  :default-size="33"
                  collapsible
                  :min-size="15"
                >
                  <PanelHeader
                    position="right"
                    :full-screen="currentFullScreenPanel === 'ndv'"
                    title="NDV"
                    :tabs="ndvTabs.tabs.value"
                    :active-tab="ndvTabs.activeTabValue.value"
                    @toggle-fullscreen="() => toggleFullScreen('ndv')"
                    @close-panel="() => togglePanelVisibility('ndv')"
                    @update:active-tab="ndvTabs.setActiveTab"
                  >
                    <template #controls>
                      <ReusableDropdown
                        trigger-label="Add tab"
                        :items="dropdownItems"
                        @item-click="handleDropdownItemClick"
                        ><Plus :size="14" :stroke-width="1.5"
                      /></ReusableDropdown>
                    </template>
                  </PanelHeader>
                  <div class="panel-content">
                    <div v-if="ndvTabs.activeTab.value">
                      Node Details: {{ ndvTabs.activeTab.value.label }}
                    </div>
                    <div v-else>No node selected</div>
                  </div>
                </SplitterPanel>
              </SplitterGroup>
            </SplitterPanel>
            <SplitterResizeHandle v-if="!currentFullScreenPanel" class="handle" />
            <SplitterPanel
              v-if="panelStates.footer.isVisible"
              id="footer"
              ref="footerRef"
              :default-size="33"
              collapsible
              :min-size="15"
            >
              <PanelHeader
                position="bottom"
                :full-screen="currentFullScreenPanel === 'footer'"
                title="Footer"
                :tabs="footerTabs.tabs.value"
                :active-tab="footerTabs.activeTabValue.value"
                @toggle-fullscreen="() => toggleFullScreen('footer')"
                @close-panel="() => togglePanelVisibility('footer')"
                @update:active-tab="footerTabs.setActiveTab"
              />
              <div class="panel-content">
                Active Footer Tab: {{ footerTabs.activeTab.value?.label }}
              </div>
            </SplitterPanel>
          </SplitterGroup>
        </SplitterPanel>
      </SplitterGroup>
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.nav {
  position: relative;
  height: 100%;
  width: 42px;
  border-right: 1px solid grey;
}

.main {
  left: 42px;
  width: calc(100vw - 42px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  height: 42px;
  width: 100%;
  border-bottom: 1px solid grey;
}

.handle {
  background-color: grey;
}

.handle[data-orientation='horizontal'] {
  width: 1px;
}

.handle[data-orientation='vertical'] {
  height: 1px;
}

.panel-content {
  padding: 16px;
  font-size: 14px;
  color: #666;
}
</style>
