<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { ref } from 'vue'
import PanelHeader from './components/PanelHeader.vue'

const assistantRef = ref<InstanceType<typeof SplitterPanel>>()
const canvasRef = ref<InstanceType<typeof SplitterPanel>>()
const ndvRef = ref<InstanceType<typeof SplitterPanel>>()
const footerRef = ref<InstanceType<typeof SplitterPanel>>()

const refs = {
  canvas: canvasRef,
  ndv: ndvRef,
  footer: footerRef,
}

const preFullScreenState = ref<Record<string, number>>({})

const fullScreen = ref<string | null>(null)

const hiddenPanels = ref<Set<string>>(new Set())

function closePanel(panel: 'canvas' | 'ndv' | 'footer') {
  const panelRef = refs[panel]
  panelRef.value?.collapse()
  panelRef.value?.resize(0)
  hiddenPanels.value.add(panel)
}

function resetPanels() {
  Object.entries(refs).forEach(([key, panelRef]) => {
    const size = preFullScreenState.value[key]
    if (size !== undefined) {
      panelRef.value?.expand()
      panelRef.value?.resize(size)
    }
  })
}

function fullScreenPanel(panel: 'canvas' | 'ndv' | 'footer') {
  fullScreen.value = panel
  Object.entries(refs).forEach(([key, panelRef]) => {
    if (panelRef.value) {
      preFullScreenState.value[key] = panelRef.value.getSize()
    }
  })
  Object.entries(refs).forEach(([key, panelRef]) => {
    if (key === panel) {
      panelRef.value?.expand()
      panelRef.value?.resize(100)
    } else {
      panelRef.value?.collapse()
      panelRef.value?.resize(0)
    }
  })
}

function toggleFullScreen(panel: 'canvas' | 'ndv' | 'footer') {
  if (fullScreen.value === panel) {
    fullScreen.value = null
    resetPanels()
  } else {
    fullScreenPanel(panel)
  }
}
</script>

<template>
  <div class="wrapper">
    <nav class="nav"></nav>
    <main class="main">
      <header class="header">
        <button @click="fullScreenPanel('canvas')">Canvas</button>
        <button @click="fullScreenPanel('ndv')">NDV</button>
        <button @click="fullScreenPanel('footer')">Footer</button>
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
                <SplitterResizeHandle class="handle" />
                <SplitterPanel
                  v-if="!hiddenPanels.has('ndv')"
                  id="ndv"
                  ref="ndvRef"
                  :default-size="33"
                  collapsible
                  :min-size="15"
                >
                  <PanelHeader
                    :full-screen="fullScreen === 'ndv'"
                    title="NDV"
                    @toggle-fullscreen="() => toggleFullScreen('ndv')"
                    @close-panel="() => closePanel('ndv')"
                  />
                </SplitterPanel>
              </SplitterGroup>
            </SplitterPanel>
            <SplitterResizeHandle class="handle" />
            <SplitterPanel id="footer" ref="footerRef" :default-size="33" collapsible :min-size="15"
              >Footer</SplitterPanel
            >
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
</style>
