<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
</script>

<template>
  <div class="wrapper">
    <nav class="nav"></nav>
    <main class="main">
      <header class="header"></header>
      <SplitterGroup auto-save-id="editor-1" direction="horizontal">
        <SplitterPanel :max-size="40" :default-size="20" collapsible :min-size="15"
          >Assistant</SplitterPanel
        >
        <SplitterResizeHandle class="handle" />
        <SplitterPanel>
          <SplitterGroup auto-save-id="editor-2" direction="vertical">
            <SplitterPanel>
              <SplitterGroup auto-save-id="editor-3" direction="horizontal">
                <SplitterPanel>Canvas</SplitterPanel>
                <SplitterResizeHandle class="handle" />
                <SplitterPanel :default-size="33" collapsible :min-size="15">NDV</SplitterPanel>
              </SplitterGroup>
            </SplitterPanel>
            <SplitterResizeHandle class="handle" />
            <SplitterPanel :default-size="33" collapsible :min-size="15">Footer</SplitterPanel>
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
  border-right: 1px solid black;
}

.main {
  background-color: aqua;
  left: 42px;
  width: calc(100vw - 42px);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  height: 42px;
  width: 100%;
  border-bottom: 1px solid black;
  background-color: yellow;
}

.handle {
  background-color: red;
}

.handle[data-orientation='horizontal'] {
  width: 2px;
  cursor: ew-resize;
}

.handle[data-orientation='vertical'] {
  height: 2px;
  cursor: ew-resize;
}
</style>
