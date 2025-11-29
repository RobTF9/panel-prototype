<script setup lang="ts"></script>

<template>
  <div class="wrapper">
    <nav class="nav"></nav>
    <main class="main">
      <header class="header"></header>
      <div class="content">
        <div class="left-panel"></div>
        <div class="container">
          <div class="center">
            <div class="main-panel"></div>
            <div class="right-panel"></div>
          </div>
          <footer class="footer"></footer>
        </div>
      </div>
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

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
  width: 100%;
  background-color: lime;
}

.left-panel {
  width: 200px;
  border-right: 1px solid black;
  background-color: orange;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.center {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-panel {
  flex: 1;
  background-color: white;
}

.right-panel {
  width: 300px;
  border-left: 1px solid black;
  background-color: pink;
}
.footer {
  height: 30px;
  width: 100%;
  border-top: 1px solid black;
  background-color: purple;
}
</style>
