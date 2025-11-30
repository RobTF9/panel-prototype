import { ref, computed } from 'vue'

export interface Tab {
  value: string
  label: string
  content?: any
}

export interface TabsConfig {
  tabs: Tab[]
  defaultValue?: string
}

export function useTabs(config: TabsConfig) {
  const activeTabValue = ref(config.defaultValue || config.tabs[0]?.value || '')
  
  const activeTab = computed(() => 
    config.tabs.find(tab => tab.value === activeTabValue.value) || config.tabs[0]
  )
  
  const setActiveTab = (value: string) => {
    if (config.tabs.some(tab => tab.value === value)) {
      activeTabValue.value = value
    }
  }
  
  return {
    tabs: config.tabs,
    activeTab,
    activeTabValue,
    setActiveTab
  }
}