<script setup lang="ts">
import { Viewer } from "@/app/Viewer";
import { ref, onMounted } from "vue";

const application = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const canvas = application.value;
  if (!canvas) throw new Error("Cannot find canvas element.");

  const viewer = new Viewer(canvas);
  viewer.start();
});
</script>

<template>
  <!-- <v-container> -->
  <canvas ref="application" id="playcanvas" />
  <!-- </v-container> -->
</template>

<style scoped>
.playcanvas {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
