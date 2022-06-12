<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  { id: 0, label: "A" },
  { id: 3, label: "B" },
  { id: 1, label: "C" },
]);
</script>

<template>
  <div class="ui">
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
  z-index: 1;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 0.2em;
}

v-btn.button {
}
</style>
