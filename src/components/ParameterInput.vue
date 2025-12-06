<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

interface Parameter {
  key: string
  type: string
  value: string
}

const props = defineProps<{
  parameter: Parameter
}>()

const emit = defineEmits<{
  (e: 'update:value', key: string, value: string): void
  (e: 'focus-parameter', key: string): void
}>()

function updateValue(value: string) {
  emit('update:value', props.parameter.key, value)
}

function focusParameter() {
  emit('focus-parameter', props.parameter.key)
}
</script>

<template>
  <div class="ParameterInput">
    <div class="parameter-header">
      <label class="ParameterLabel">{{ parameter.key }}</label>
      <button 
        class="focus-button"
        @click="focusParameter"
        title="Focus this parameter"
      >
        <Plus :size="14" />
      </button>
    </div>
    
    <!-- All inputs are now textareas -->
    <textarea
      :value="parameter.value"
      @input="updateValue(($event.target as HTMLTextAreaElement).value)"
      class="ParameterTextarea"
    ></textarea>
  </div>
</template>

<style scoped>
.ParameterInput {
  margin-bottom: 16px;
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.ParameterLabel {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.focus-button {
  background: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  padding: 2px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.15s ease;
}

.focus-button:hover {
  background-color: #f0f0f0;
  border-color: #007acc;
  color: #007acc;
}

.ParameterTextarea {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  resize: vertical;
  min-height: 200px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.ParameterTextarea:focus {
  outline: none;
  border-color: #007acc;
}
</style>