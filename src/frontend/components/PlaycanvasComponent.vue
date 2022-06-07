<script setup lang="ts">
import { Viewer } from "@/app/Viewer";
import { ref, onMounted } from "vue";

const application = ref(null);

onMounted(() => {
  const canvas = application.value as unknown as Element;
  const viewer = new Viewer(canvas);
  viewer.start();
});
</script>

<template>
  <!-- <v-container> -->
  <canvas ref="application" id="playcanvas" />
  <!-- </v-container> -->
</template>
