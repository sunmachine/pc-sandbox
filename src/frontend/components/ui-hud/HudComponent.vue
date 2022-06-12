<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  { id: 0, label: "A" },
  { id: 3, label: "B" },
  { id: 1, label: "C" },
]);
</script>

<template>
  <div class="ui rounded-lg">
    <div v-for="item in items" :key="item.id">
      <v-btn class="ui-button" flat>{{ item.label }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
.ui {
  position: absolute;
  bottom: 1.6rem;
  left: 1.6rem;

  padding: 0.33em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 0.33em;

  background-color: rgb(var(--v-theme-background));
}
</style>
