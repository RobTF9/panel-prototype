import { ref, computed } from 'vue'

export interface Tab {
  value: string
  label: string
  content?: unknown
}

export interface TabsConfig {
  tabs?: Tab[]
  defaultValue?: string
}

export function useTabs(config: TabsConfig = {}) {
  const tabs = ref<Tab[]>(config.tabs || [])
  const activeTabValue = ref(config.defaultValue || '')
  
  const activeTab = computed(() => 
    tabs.value.find(tab => tab.value === activeTabValue.value) || tabs.value[0]
  )
  
  const setActiveTab = (value: string) => {
    if (tabs.value.some(tab => tab.value === value)) {
      activeTabValue.value = value
    }
  }

  const addTab = (tab: Tab) => {
    const existingTab = tabs.value.find(t => t.value === tab.value)
    if (!existingTab) {
      tabs.value.push(tab)
    }
    activeTabValue.value = tab.value
    return existingTab ? false : true
  }

  const removeTab = (value: string) => {
    const index = tabs.value.findIndex(tab => tab.value === value)
    if (index > -1) {
      tabs.value.splice(index, 1)
      if (activeTabValue.value === value && tabs.value.length > 0) {
        const newIndex = Math.max(0, index - 1)
        const newTab = tabs.value[newIndex]
        if (newTab) {
          activeTabValue.value = newTab.value
        }
      } else if (tabs.value.length === 0) {
        activeTabValue.value = ''
      }
      return true
    }
    return false
  }

  const hasTab = (value: string) => {
    return tabs.value.some(tab => tab.value === value)
  }
  
  return {
    tabs,
    activeTab,
    activeTabValue,
    setActiveTab,
    addTab,
    removeTab,
    hasTab
  }
}