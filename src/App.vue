<script setup lang="ts">
import PlaycanvasComponent from "./components/PlaycanvasComponent.vue";
</script>

<template>
  <main>
    <PlaycanvasComponent />
  </main>
</template>

<style>
@import "./assets/base.css";

#app {
  font-weight: normal;
  overflow: hidden;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}
</style>
