<script lang="ts" setup>
interface FakeNode {
  id: string
  name: string
  params: Record<string, { type: string; value: string }>
}

defineProps<{
  nodes: FakeNode[]
}>()

defineEmits<{
  (e: 'node-dblclick', nodeId: string): void
  (e: 'node-click', nodeId: string): void
}>()
</script>

<template>
  <div class="FakeNodesContainer">
    <div
      @dblclick="$emit('node-dblclick', node.id)"
      @click="$emit('node-click', node.id)"
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
</style>
