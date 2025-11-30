<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { ref } from 'vue'
import PanelHeader from './components/PanelHeader.vue'
import { useEditorPanels } from './composables/useEditorPanels'
import { useTabs } from './composables/useTabs'

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

// Setup tabs for NDV panel
const ndvTabs = useTabs({
  tabs: [
    { value: 'tab1', label: 'Tab1' },
    { value: 'tab2', label: 'Tab2' },
    { value: 'tab3', label: 'Tab3' },
  ],
  defaultValue: 'tab1',
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
                <SplitterPanel :default-size="66" id="canvas" ref="canvasRef" collapsible
                  >Canvas</SplitterPanel
                >
                <SplitterResizeHandle v-if="!currentFullScreenPanel" class="handle" />
                <SplitterPanel
                  v-if="panelStates.ndv.isVisible"
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
                    :tabs="ndvTabs.tabs"
                    :active-tab="ndvTabs.activeTabValue.value"
                    @toggle-fullscreen="() => toggleFullScreen('ndv')"
                    @close-panel="() => togglePanelVisibility('ndv')"
                    @update:active-tab="ndvTabs.setActiveTab"
                  />
                  <div class="panel-content">
                    Active NDV Tab: {{ ndvTabs.activeTab.value?.label }}
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
                :tabs="footerTabs.tabs"
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
