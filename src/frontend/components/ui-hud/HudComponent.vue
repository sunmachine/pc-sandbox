<script setup lang="ts">
import { ref } from "vue";

// https://materialdesignicons.com/ <--
const items = ref([
  { id: 0, icon: "mdi-file-upload" },
  { id: 3, icon: "mdi-weather-sunset" },
  { id: 1, icon: "mdi-image-filter-center-focus" },
]);
</script>

<template>
  <div class="ui rounded-lg">
    <div v-for="item in items" :key="item.id">
      <v-btn class="ui-button" icon rounded="lg">
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
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
