<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import PanelHeader from './components/PanelHeader.vue'
import { useEditorPanels } from './composables/useEditorPanels'
import { useTabs } from './composables/useTabs'
import ReusableDropdown from './components/ReusableDropdown.vue'
import type { DropdownItem } from './components/ReusableDropdown.vue'
import { Plus } from 'lucide-vue-next'
import FakeCanvas from './components/FakeCanvas.vue'
import ParameterInput from './components/ParameterInput.vue'

const assistantRef = ref<InstanceType<typeof SplitterPanel>>()
const canvasRef = ref<InstanceType<typeof SplitterPanel>>()
const ndvRef = ref<InstanceType<typeof SplitterPanel>>()
const footerRef = ref<InstanceType<typeof SplitterPanel>>()

// NDV panel width detection
const ndvPanelWidth = ref(0)
const ndvPanelElement = ref<HTMLElement>()

const isWideLayout = computed(() => ndvPanelWidth.value > 850)

// Track panel maximized states
const isNdvMaximized = computed(() => isPanelMaximized('ndv'))
const isFooterMaximized = computed(() => isPanelMaximized('footer'))

const {
  panelStates,
  togglePanelVisibility,
  currentFullScreenPanel,
  toggleFullScreen,
  resetPanels,
  isPanelMaximized,
  resetPanelSize,
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
    // Add new tab with replace unpinned behavior
    ndvTabs.addTab({ value: tabValue, label: tabLabel, isPinned: false }, true)
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

// Setup tabs for assistant panel
const assistantTabs = useTabs({
  tabs: [
    { value: 'assistant', label: 'Assistant' },
    { value: 'setup', label: 'Setup' },
  ],
  defaultValue: 'assistant',
})

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

// Search state
const searchQuery = ref('')
const flattenedItems = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  const items: Array<{ id: string; label: string; nodeId: string; paramId?: string }> = []

  nodes.value.forEach((node) => {
    // Add matching nodes
    if (node.name.toLowerCase().includes(query)) {
      items.push({
        id: `node-${node.id}`,
        label: node.name,
        nodeId: node.id,
      })
    }

    // Add matching params
    Object.entries(node.params).forEach(([paramKey]) => {
      if (paramKey.toLowerCase().includes(query) || node.name.toLowerCase().includes(query)) {
        items.push({
          id: `param-${node.id}-${paramKey}`,
          label: `${node.name} / ${paramKey}`,
          nodeId: node.id,
          paramId: paramKey,
        })
      }
    })
  })

  return items
})

// Handle search
const handleSearch = (query: string) => {
  searchQuery.value = query
}

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
    // Add new tab with replace unpinned behavior
    ndvTabs.addTab({ value: tabValue, label: tabLabel, isPinned: false }, true)
  }

  // Show NDV panel if hidden
  if (!panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
}

function toggleAssistantPanel() {
  console.log('Toggling assistant panel')
  if (assistantRef.value?.isExpanded) {
    assistantRef.value.collapse()
  } else {
    assistantRef.value?.expand()
  }
}

function handleNodeAdded(node: FakeNode) {
  nodes.value.push(node)
}

// Handle canvas click to close NDV
function handleCanvasClick() {
  if (panelStates.value.ndv.isVisible && ndvTabs.tabs.value.length > 0) {
    togglePanelVisibility('ndv')
  }
}

// Handle tab actions
function handleTabClose(tabValue: string) {
  ndvTabs.removeTab(tabValue)
  // Close NDV panel if no tabs remain
  if (ndvTabs.tabs.value.length === 0 && panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
}

function handleTabTogglePin(tabValue: string) {
  ndvTabs.togglePin(tabValue)
}

// Get current node data and param info for active tab
const currentTabInfo = computed(() => {
  const activeTab = ndvTabs.activeTab.value
  if (!activeTab) return null

  const parts = activeTab.value.split('-')
  const nodeId = parts[1]
  const node = nodes.value.find((n) => n.id === nodeId)

  if (!node) return null

  // Check if this is a parameter tab (format: "node-{id}-param-{param}")
  if (parts.length === 4 && parts[2] === 'param') {
    const paramKey = parts[3]
    return {
      type: 'parameter',
      node,
      paramKey,
      paramValue: node.params[paramKey]?.value || '',
    }
  }

  // Otherwise it's a node tab
  return {
    type: 'node',
    node,
    parameters: Object.entries(node.params).map(([key, param]) => ({
      key,
      type: param.type,
      value: param.value,
    })),
  }
})

// Backward compatibility - keep these for existing code
const currentNode = computed(() => {
  const info = currentTabInfo.value
  return info?.node || null
})

const currentParameters = computed(() => {
  const info = currentTabInfo.value
  return info?.type === 'node' ? info.parameters : []
})

// Handle parameter updates
function handleParameterUpdate(nodeId: string, paramKey: string, value: string) {
  const node = nodes.value.find((n) => n.id === nodeId)
  if (node && node.params[paramKey]) {
    node.params[paramKey].value = value
  }
}

// Handle single parameter update (for parameter-focused tabs)
function handleSingleParameterUpdate(value: string) {
  const info = currentTabInfo.value
  if (info?.type === 'parameter') {
    handleParameterUpdate(info.node.id, info.paramKey, value)
  }
}

// Handle parameter focus (create parameter-specific tab)
function handleParameterFocus(nodeId: string, paramKey: string) {
  const node = nodes.value.find((n) => n.id === nodeId)
  if (!node) return

  const tabValue = `node-${nodeId}-param-${paramKey}`
  const tabLabel = `${node.name} / ${paramKey}`

  if (ndvTabs.hasTab(tabValue)) {
    // Switch to existing tab
    ndvTabs.setActiveTab(tabValue)
  } else {
    // Add new parameter tab
    ndvTabs.addTab({ value: tabValue, label: tabLabel, isPinned: false })
  }

  // Show NDV panel if hidden
  if (!panelStates.value.ndv.isVisible) {
    togglePanelVisibility('ndv')
  }
}

// Handle node actions from canvas
function handleNodeAction(action: string, nodeId: string, paramKey?: string) {
  if (action === 'parameter' && paramKey) {
    handleParameterFocus(nodeId, paramKey)
  } else {
    // Handle other dummy actions
    console.log(`Action: ${action}, Node: ${nodeId}`)
  }
}

// Width detection for NDV panel
let resizeObserver: ResizeObserver | null = null

function updateNdvWidth() {
  if (ndvPanelElement.value) {
    ndvPanelWidth.value = ndvPanelElement.value.clientWidth
    console.log('NDV panel width:', ndvPanelWidth.value, 'Wide layout:', ndvPanelWidth.value > 850)
  }
}

function setupResizeObserver() {
  if (ndvPanelElement.value) {
    resizeObserver = new ResizeObserver(() => {
      updateNdvWidth()
    })
    resizeObserver.observe(ndvPanelElement.value)
    updateNdvWidth() // Initial measurement
  }
}

// Watch for NDV panel visibility changes
watch(
  () => panelStates.value.ndv.isVisible && ndvTabs.tabs.value.length > 0,
  (isVisible) => {
    if (isVisible) {
      nextTick(() => {
        setupResizeObserver()
      })
    }
  },
)

onMounted(() => {
  window.addEventListener('resize', updateNdvWidth)
  // Setup observer after a short delay to ensure DOM is ready
  setTimeout(() => {
    setupResizeObserver()
  }, 200)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNdvWidth)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Handle header button clicks for NDV and footer panels
function handleNdvHeaderAction() {
  if (isNdvMaximized.value) {
    resetPanelSize('ndv')
  } else {
    toggleFullScreen('ndv')
  }
}

function handleFooterHeaderAction() {
  if (isFooterMaximized.value) {
    resetPanelSize('footer')
  } else {
    toggleFullScreen('footer')
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
        >
          <PanelHeader
            position="right"
            :full-screen="false"
            title="Assistant"
            :tabs="assistantTabs.tabs.value"
            :active-tab="assistantTabs.activeTabValue.value"
            :show-tab-actions="false"
            :show-fullscreen-button="false"
            @close-panel="toggleAssistantPanel"
            @update:active-tab="assistantTabs.setActiveTab"
          />
          <div class="panel-content">
            <div v-if="assistantTabs.activeTabValue.value === 'assistant'">
              <p>Assistant content will go here</p>
            </div>
            <div v-else-if="assistantTabs.activeTabValue.value === 'setup'">
              <p>Setup configuration will go here</p>
            </div>
          </div>
        </SplitterPanel>
        <SplitterResizeHandle class="handle" />
        <SplitterPanel>
          <SplitterGroup auto-save-id="editor-2" direction="vertical">
            <SplitterPanel>
              <SplitterGroup auto-save-id="editor-3" direction="horizontal">
                <SplitterPanel :default-size="66" id="canvas" ref="canvasRef" collapsible>
                  <FakeCanvas
                    @left-drawer-toggle="toggleAssistantPanel"
                    @right-drawer-toggle="togglePanelVisibility('ndv')"
                    @bottom-drawer-toggle="togglePanelVisibility('footer')"
                    :nodes="nodes"
                    @node-click="handleNodeClick"
                    @node-dblclick="handleNodeDoubleClick"
                    @node-added="handleNodeAdded"
                    @canvas-click="handleCanvasClick"
                    @node-action="handleNodeAction"
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
                  <div ref="ndvPanelElement" class="ndv-panel-container">
                    <PanelHeader
                      position="right"
                      :full-screen="currentFullScreenPanel === 'ndv'"
                      :is-maximized="isNdvMaximized"
                      title="NDV"
                      :tabs="ndvTabs.tabs.value"
                      :active-tab="ndvTabs.activeTabValue.value"
                      :show-tab-actions="true"
                      :show-fullscreen-button="true"
                      @toggle-fullscreen="handleNdvHeaderAction"
                      @close-panel="() => togglePanelVisibility('ndv')"
                      @update:active-tab="ndvTabs.setActiveTab"
                      @close-tab="handleTabClose"
                      @toggle-pin="handleTabTogglePin"
                    >
                    </PanelHeader>
                    <!-- Wide layout (> 850px) -->
                    <div v-if="isWideLayout" class="ndv-wide-content">
                      <!-- Parameter-focused view - 3 columns -->
                      <div v-if="currentTabInfo?.type === 'parameter'" class="param-wide-layout">
                        <SplitterGroup direction="horizontal" auto-save-id="ndv-param-wide">
                          <!-- Input panel -->
                          <SplitterPanel :default-size="30" :min-size="20">
                            <div class="placeholder-panel">
                              <h4>Input</h4>
                              <p>Parameter input data will go here</p>
                            </div>
                          </SplitterPanel>
                          <SplitterResizeHandle class="handle" />

                          <!-- Main parameter editor -->
                          <SplitterPanel :default-size="40" :min-size="30">
                            <div class="single-parameter-view-wide">
                              <textarea
                                :value="currentTabInfo.paramValue"
                                @input="
                                  handleSingleParameterUpdate(
                                    ($event.target as HTMLTextAreaElement).value,
                                  )
                                "
                                class="full-height-textarea"
                              ></textarea>
                            </div>
                          </SplitterPanel>
                          <SplitterResizeHandle class="handle" />

                          <!-- Result panel -->
                          <SplitterPanel :default-size="30" :min-size="20">
                            <div class="result-panel">
                              <h4>Result</h4>
                              <textarea
                                :value="currentTabInfo.paramValue"
                                readonly
                                class="result-textarea"
                              ></textarea>
                            </div>
                          </SplitterPanel>
                        </SplitterGroup>
                      </div>

                      <!-- Node overview - 3 columns -->
                      <div v-else-if="currentTabInfo?.type === 'node'" class="node-wide-layout">
                        <SplitterGroup direction="horizontal" auto-save-id="ndv-node-wide">
                          <!-- Input panel -->
                          <SplitterPanel :default-size="25" :min-size="20">
                            <div class="placeholder-panel">
                              <h4>Input</h4>
                              <p>Node input data will go here</p>
                            </div>
                          </SplitterPanel>
                          <SplitterResizeHandle class="handle" />

                          <!-- Parameters -->
                          <SplitterPanel :default-size="50" :min-size="30">
                            <div class="parameters-content">
                              <ParameterInput
                                v-for="param in currentParameters"
                                :key="param.key"
                                :parameter="param"
                                @update:value="
                                  (key, value) => handleParameterUpdate(currentNode!.id, key, value)
                                "
                                @focus-parameter="
                                  (key) => handleParameterFocus(currentNode!.id, key)
                                "
                              />
                            </div>
                          </SplitterPanel>
                          <SplitterResizeHandle class="handle" />

                          <!-- Output panel -->
                          <SplitterPanel :default-size="25" :min-size="20">
                            <div class="placeholder-panel">
                              <h4>Output</h4>
                              <p>Node output data will go here</p>
                            </div>
                          </SplitterPanel>
                        </SplitterGroup>
                      </div>
                    </div>

                    <!-- Narrow layout (≤ 850px) - original single column -->
                    <div v-else class="panel-content">
                      <!-- Parameter-focused view -->
                      <div
                        v-if="currentTabInfo?.type === 'parameter'"
                        class="single-parameter-view"
                      >
                        <textarea
                          :value="currentTabInfo.paramValue"
                          @input="
                            handleSingleParameterUpdate(
                              ($event.target as HTMLTextAreaElement).value,
                            )
                          "
                          class="full-height-textarea"
                        ></textarea>
                      </div>

                      <!-- Node overview with all parameters -->
                      <div v-else-if="currentTabInfo?.type === 'node'">
                        <ParameterInput
                          v-for="param in currentParameters"
                          :key="param.key"
                          :parameter="param"
                          @update:value="
                            (key, value) => handleParameterUpdate(currentNode!.id, key, value)
                          "
                          @focus-parameter="(key) => handleParameterFocus(currentNode!.id, key)"
                        />
                      </div>

                      <div v-else>No active node.</div>
                    </div>
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
                :is-maximized="isFooterMaximized"
                title="Footer"
                :tabs="footerTabs.tabs.value"
                :active-tab="footerTabs.activeTabValue.value"
                :show-tab-actions="false"
                :show-fullscreen-button="true"
                @toggle-fullscreen="handleFooterHeaderAction"
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
  height: calc(100vh - 33px - 16px);
  overflow: auto;
}

.node-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.parameters-section {
  margin-top: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 12px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.single-parameter-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.parameter-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.full-height-textarea {
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  resize: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.full-height-textarea:focus {
  outline: none;
  border-color: #007acc;
}

.ndv-panel-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.ndv-wide-content {
  flex: 1;
  height: calc(100% - 33px);
}

.param-wide-layout,
.node-wide-layout {
  height: 100%;
}

.single-parameter-view-wide {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.single-parameter-view-wide .full-height-textarea {
  flex: 1;
}

.parameters-content {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

.placeholder-panel {
  padding: 16px;
  background: #f9f9f9;
  border-right: 1px solid #eee;
  height: 100%;
}

.placeholder-panel h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.placeholder-panel p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.result-panel {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.result-panel h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.result-textarea {
  flex: 1;
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #f9f9f9;
  resize: none;
  font-family: inherit;
  color: #666;
}
</style>
