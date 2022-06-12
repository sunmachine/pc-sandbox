<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { inject, ref } from "vue";

// https://materialdesignicons.com/ <--
const viewer = inject<Viewer>("viewer");

const toolbarItems = ref([
  {
    id: 0,
    icon: "mdi-image-filter-center-focus",
    callback: () => {
      if (viewer?.camera) viewer?.camera?.focusOnEntity();
    },
  },
]);
</script>

<template>
  <div class="ui rounded-lg">
    <div v-for="item in toolbarItems" :key="item.id">
      <v-btn
        ref="myButton"
        class="ui-button"
        icon
        rounded="lg"
        @click="item.callback"
      >
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
