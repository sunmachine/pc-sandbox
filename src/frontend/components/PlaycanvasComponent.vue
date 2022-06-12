<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { ref, onMounted, inject } from "vue";
import HudComponent from "./ui-hud/HudComponent.vue";

const application = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const pcCanvas = application.value;
  if (!pcCanvas) throw new Error("Cannot find canvas element.");

  const viewer = inject<Viewer>("viewer");
  if (viewer) {
    viewer.initialize(pcCanvas);
    viewer.start();
  }
});
</script>

<template>
  <HudComponent id="hud" />
  <canvas ref="application" id="playcanvas" />
</template>

<style scoped>
#playcanvas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

#hud {
  z-index: 1;
}
</style>
