<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { TreeRoot, TreeItem } from 'reka-ui'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import { Loader, CircleCheck, CircleX, Hourglass, X } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'

interface ExecutionNode {
  id: string
  name: string
  status: 'success' | 'error' | 'loading' | 'waiting'
  children?: ExecutionNode[]
  output?: any
}

interface Execution {
  id: string
  timestamp: string
  status: 'success' | 'error' | 'loading' | 'waiting'
  nodes: ExecutionNode[]
}

const selectedExecutionId = ref<string>('')
const selectedNodeId = ref<string>('')
const showColumn2 = ref(false)
const showColumn3 = ref(false)
const selectedDataTab = ref('json')

// Generate dummy execution data
function generateExecutionData(): Execution[] {
  const executions: Execution[] = []
  const now = new Date()

  const nodeNames = ['Trigger', 'Agent', 'Code', 'HTTP Request', 'Transform', 'Filter', 'Webhook']

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000) // 15 minutes apart
    const status = i === 0 ? 'loading' : (['success', 'error', 'success', 'success'][i % 4] as any)

    // Generate node tree (same structure for all executions)
    const nodes: ExecutionNode[] = [
      {
        id: 'node-1',
        name: 'Trigger',
        status: status === 'loading' ? 'loading' : 'success',
        output: { type: 'webhook', data: { payload: 'received' } },
        children: [
          {
            id: 'node-2',
            name: 'Agent',
            status: status === 'loading' ? 'waiting' : status,
            output: { response: 'Hello, how can I help?', tokens: 156 },
            children: [
              {
                id: 'node-2-1',
                name: 'Sub Agent',
                status: status === 'loading' ? 'waiting' : status,
                output: { analysis: 'User intent detected', confidence: 0.95 },
              },
            ],
          },
          {
            id: 'node-3',
            name: 'Code',
            status: status === 'loading' ? 'waiting' : status,
            output: { result: [1, 2, 3, 4, 5], executionTime: '45ms' },
            children: [
              {
                id: 'node-3-1',
                name: 'Validation',
                status: status === 'loading' ? 'waiting' : status,
                output: { valid: true, errors: [] },
              },
              {
                id: 'node-3-2',
                name: 'Transform',
                status: status === 'loading' ? 'waiting' : status,
                output: { transformed: { count: 5, sum: 15 } },
              },
            ],
          },
        ],
      },
    ]

    executions.push({
      id: `exec-${i}`,
      timestamp: timestamp.toLocaleString(),
      status,
      nodes,
    })
  }

  return executions
}

const executions = ref<Execution[]>([])

const selectedExecution = computed(() =>
  executions.value.find((e) => e.id === selectedExecutionId.value),
)

const selectedNode = computed(() => {
  if (!selectedExecution.value || !selectedNodeId.value) return null

  function findNode(nodes: ExecutionNode[]): ExecutionNode | null {
    for (const node of nodes) {
      if (node.id === selectedNodeId.value) return node
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return null
  }

  return findNode(selectedExecution.value.nodes)
})

// Flatten tree for TreeRoot
const treeItems = computed(() => {
  if (!selectedExecution.value) return []

  function flattenNodes(nodes: ExecutionNode[], level = 0): any[] {
    const result: any[] = []
    for (const node of nodes) {
      result.push({ ...node, level })
      if (node.children) {
        result.push(...flattenNodes(node.children, level + 1))
      }
    }
    return result
  }

  return flattenNodes(selectedExecution.value.nodes)
})

function selectExecution(executionId: string) {
  selectedExecutionId.value = executionId
  // Don't change column visibility or node selection when switching executions
  // Keep columns open and selection persistent
}

function selectNode(selection: any) {
  // Handle Reka UI Tree selection format - could be array or reactive proxy
  let nodeId = ''
  
  if (Array.isArray(selection)) {
    nodeId = selection[0] || ''
  } else if (selection && typeof selection === 'object') {
    // Check if it's a string that got turned into a character array
    const keys = Object.keys(selection)
    if (keys.every(key => !isNaN(Number(key)))) {
      // It's a string broken into character indices - reconstruct it
      const values = Object.values(selection) as string[]
      nodeId = values.join('')
    } else {
      // Try other Vue reactivity patterns
      if ('value' in selection) {
        nodeId = Array.isArray(selection.value) ? selection.value[0] : selection.value
      } else if ('_value' in selection) {
        nodeId = Array.isArray(selection._value) ? selection._value[0] : selection._value
      }
    }
  }
  
  selectedNodeId.value = nodeId
  showColumn3.value = !!nodeId
}


function closeColumn2() {
  showColumn2.value = false
  showColumn3.value = false
  selectedNodeId.value = ''
}

function closeColumn3() {
  showColumn3.value = false
  selectedNodeId.value = ''
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'loading':
      return Loader
    case 'success':
      return CircleCheck
    case 'error':
      return CircleX
    case 'waiting':
      return Hourglass
    default:
      return CircleCheck
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'loading':
      return '#007acc'
    case 'success':
      return '#28a745'
    case 'error':
      return '#dc3545'
    case 'waiting':
      return '#ffc107'
    default:
      return '#6c757d'
  }
}

onMounted(() => {
  executions.value = generateExecutionData()
  // Auto-select the first execution and show column 2
  if (executions.value.length > 0) {
    selectedExecutionId.value = executions.value[0]!.id
    showColumn2.value = true
  }
})

const treeModelValue = computed(() => {
  return selectedNodeId.value ? [selectedNodeId.value] : []
})
</script>

<template>
  <div class="execution-tab">
    <SplitterGroup direction="horizontal" auto-save-id="execution-columns">
      <!-- Column 1: Executions List -->
      <SplitterPanel :default-size="20" :min-size="5">
        <div class="executions-column">
          <div class="executions-list">
            <div
              v-for="execution in executions"
              :key="execution.id"
              class="execution-item"
              :class="{ active: selectedExecutionId === execution.id }"
              @click="selectExecution(execution.id)"
            >
              <component
                :is="getStatusIcon(execution.status)"
                :size="16"
                :color="getStatusColor(execution.status)"
                :class="{ spinning: execution.status === 'loading' }"
              />
              <div class="execution-info">
                <div class="execution-time">{{ execution.timestamp }}</div>
              </div>
            </div>
          </div>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle v-if="showColumn2" class="handle" />

      <!-- Column 2: Node Tree -->
      <SplitterPanel v-if="showColumn2" :default-size="20" :min-size="5">
        <div class="nodes-column">
          <div class="nodes-tree" v-if="selectedExecution">
            <TreeRoot
              :items="selectedExecution.nodes"
              :model-value="treeModelValue"
              @update:model-value="selectNode"
              :get-key="(node) => node.id"
              :get-children="(node) => node.children || []"
            >
              <TreeItem
                v-for="item in treeItems"
                :key="item.id"
                :value="item.id"
                :level="item.level"
                :class="`tree-item-level-${item.level}`"
              >
                <div class="tree-trigger" :class="{ 'force-selected': selectedNodeId === item.id }">
                  <component
                    :is="getStatusIcon(item.status)"
                    :size="14"
                    :color="getStatusColor(item.status)"
                    :class="{ spinning: item.status === 'loading' }"
                  />
                  <span>{{ item.name }}</span>
                </div>
              </TreeItem>
            </TreeRoot>
          </div>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle v-if="showColumn3" class="handle" />

      <!-- Column 3: Output Data -->
      <SplitterPanel v-if="showColumn3" :default-size="60">
        <div class="output-column">
          <div class="column-header">
            <h4>{{ selectedNode?.name }} output</h4>
            <button class="close-button" @click="closeColumn3">
              <X :size="16" />
            </button>
          </div>
          <div class="output-content" v-if="selectedNode">
            <TabsRoot :model-value="selectedDataTab" @update:model-value="selectedDataTab = $event">
              <TabsList class="data-tabs">
                <TabsTrigger value="schema" class="data-tab">Schema</TabsTrigger>
                <TabsTrigger value="json" class="data-tab">JSON</TabsTrigger>
                <TabsTrigger value="table" class="data-tab">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="schema" class="tab-content">
                <pre class="data-display">{{ JSON.stringify(selectedNode.output, null, 2) }}</pre>
              </TabsContent>
              <TabsContent value="json" class="tab-content">
                <pre class="data-display">{{ JSON.stringify(selectedNode.output, null, 2) }}</pre>
              </TabsContent>
              <TabsContent value="table" class="tab-content">
                <div class="table-view">
                  <table>
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="[key, value] in Object.entries(selectedNode.output || {})"
                        :key="key"
                      >
                        <td>{{ key }}</td>
                        <td>{{ typeof value === 'object' ? JSON.stringify(value) : value }}</td>
                        <td>{{ typeof value }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </TabsRoot>
          </div>
        </div>
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>

<style scoped>
.execution-tab {
  height: 100%;
  width: 100%;
}

.executions-column,
.nodes-column,
.output-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.column-header h4 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  color: #666;
}

.close-button:hover {
  background: #e9ecef;
  color: #333;
}

.executions-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.execution-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.execution-item:hover {
  background: #f0f0f0;
}

.execution-item.active {
  background: #e3f2fd;
}

.execution-info {
  flex: 1;
  min-width: 0;
}

.execution-time {
  font-size: 12px;
  color: #666;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.nodes-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.tree-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.15s;
  font-size: 14px;
}

.tree-item-level-0 .tree-trigger {
  padding-left: 8px;
}

.tree-item-level-1 .tree-trigger {
  padding-left: 24px;
}

.tree-item-level-2 .tree-trigger {
  padding-left: 40px;
}

.tree-trigger:hover {
  background: #f0f0f0;
}

.tree-item[data-state='selected'] .tree-trigger {
  background: #e3f2fd !important;
}

/* Alternative selectors in case Reka UI uses different attributes */
.tree-item[aria-selected='true'] .tree-trigger {
  background: #e3f2fd !important;
}

.tree-item.selected .tree-trigger {
  background: #e3f2fd !important;
}

/* Force selection styling based on our reactive state */
.tree-trigger.force-selected {
  background: #e3f2fd !important;
}

.output-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.data-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.data-tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
}

.data-tab[data-state='active'] {
  color: #007acc;
  border-bottom-color: #007acc;
}

.tab-content {
  flex: 1;
  overflow: auto;
}

.data-display {
  padding: 16px;
  margin: 0;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  overflow: auto;
}

.table-view {
  padding: 16px;
}

.table-view table {
  width: 100%;
  border-collapse: collapse;
}

.table-view th,
.table-view td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.table-view th {
  background: #f8f9fa;
  font-weight: 600;
}

.handle {
  background-color: #ddd;
  width: 1px;
}
</style>
