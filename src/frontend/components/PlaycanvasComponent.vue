<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { ref, onMounted, inject } from "vue";
import QuickMenu from "./ui-hud/QuickMenu.vue";
import ToolPanel from "./ui-hud/ToolPanel.vue";

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
  <QuickMenu id="quick-menu" />
  <ToolPanel id="tools" />
  <canvas ref="application" id="playcanvas" />
</template>

<style scoped>
#playcanvas {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
}

#quick-menu, #tools {
  z-index: 1;
}
</style>
