<script setup lang="ts">
import { runApp } from "@/engine/runApp";
import { ref, onMounted } from "vue";

const application = ref(null);
onMounted(() => {
  runApp(application.value as unknown as Element);
});
</script>

<template>
  <canvas ref="application" id="playcanvas" />
</template>
