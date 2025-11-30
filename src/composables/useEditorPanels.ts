import { ref, computed } from 'vue'
import type { SplitterPanel } from 'reka-ui'

type PanelId = 'canvas' | 'ndv' | 'footer'

interface PanelState {
  isVisible: boolean
  size: number
  isCollapsed: boolean
}

type Refs = {
  canvasRef: ReturnType<typeof ref<InstanceType<typeof SplitterPanel>>>
  ndvRef: ReturnType<typeof ref<InstanceType<typeof SplitterPanel>>>
  footerRef: ReturnType<typeof ref<InstanceType<typeof SplitterPanel>>>
}

export function useEditorPanels(refs: Refs) {
  const panelStates = ref<Record<PanelId, PanelState>>({
    canvas: { isVisible: true, size: 66, isCollapsed: false },
    ndv: { isVisible: false, size: 33, isCollapsed: false },
    footer: { isVisible: true, size: 33, isCollapsed: false },
  })

  const currentFullScreenPanel = ref<PanelId | null>(null)
  const savedStates = ref<Record<PanelId, PanelState>>({} as Record<PanelId, PanelState>)

  const isFullScreen = computed(() => currentFullScreenPanel.value !== null)

  // Map panel IDs to ref names
  const refMap = {
    canvas: refs.canvasRef,
    ndv: refs.ndvRef,
    footer: refs.footerRef,
  }

  function togglePanelVisibility(panelId: PanelId) {
    const state = panelStates.value[panelId]
    state.isVisible = !state.isVisible

    const panelRef = refMap[panelId]
    if (state.isVisible) {
      panelRef.value?.expand()
    } else {
      panelRef.value?.collapse()
    }
  }

  function setFullScreen(panelId: PanelId | null) {
    if (panelId && !isFullScreen.value) {
      // Save current states before entering fullscreen
      Object.entries(refMap).forEach(([key, ref]) => {
        if (ref.value) {
          savedStates.value[key as PanelId] = {
            ...panelStates.value[key as PanelId],
            size: ref.value.getSize(),
          }
        }
      })

      currentFullScreenPanel.value = panelId

      // Set fullscreen panel to 100%, collapse others
      Object.entries(refMap).forEach(([key, ref]) => {
        if (key === panelId) {
          ref.value?.expand()
          ref.value?.resize(100)
          panelStates.value[key as PanelId].isCollapsed = false
        } else {
          ref.value?.collapse()
          panelStates.value[key as PanelId].isCollapsed = true
        }
      })
    } else if (isFullScreen.value) {
      // Exit fullscreen - restore saved states
      currentFullScreenPanel.value = null

      Object.entries(refMap).forEach(([key, ref]) => {
        const savedState = savedStates.value[key as PanelId]
        const currentState = panelStates.value[key as PanelId]

        if (savedState && currentState.isVisible) {
          ref.value?.expand()
          ref.value?.resize(savedState.size)
          currentState.isCollapsed = savedState.isCollapsed
        }
      })
    }
  }

  function toggleFullScreen(panelId: PanelId) {
    if (currentFullScreenPanel.value === panelId) {
      setFullScreen(null)
    } else {
      setFullScreen(panelId)
    }
  }

  function resetPanels() {
    setFullScreen(null)

    // Reset all panels to their default states
    Object.entries(panelStates.value).forEach(([key, state]) => {
      const panelRef = refMap[key as PanelId]
      state.isVisible = true
      state.isCollapsed = false
      panelRef.value?.expand()
    })
  }

  return {
    panelStates,
    isFullScreen,
    currentFullScreenPanel,
    togglePanelVisibility,
    toggleFullScreen,
    resetPanels,
  }
}
