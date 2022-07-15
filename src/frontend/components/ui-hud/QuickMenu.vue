<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { inject, ref } from "vue";
import NotImplementedDialog from "../dialog/NotImplementedDialog.vue";
import FileInputDialog from "../dialog/FileInputDialog.vue";

interface MenuItems {
  id: number;
  icon: string;
  template?: string;
  callback?: (arg?: unknown) => void;
}

const viewer = inject<Viewer>("viewer");

const menuItems = ref([
  {
    id: 0,
    // https://materialdesignicons.com/
    icon: "mdi-image-filter-center-focus",
    callback: () => viewer?.functions.focusOnEntity(),
  },
  {
    id: 1,
    icon: "mdi-folder-open",
    template: "template-file-input",
  },
] as Array<MenuItems>);
</script>

<template>
  <div class="ui rounded-lg">
    <div v-for="item in menuItems" :key="item.id">
      <v-btn ref="hudButton" class="ui-button" icon rounded="lg"
        @click="() => !item?.template && item?.callback && item.callback()">
        <v-icon>{{ item.icon }}</v-icon>
        <not-implemented-dialog v-if="item.template === 'template-not-implemented'" />
        <file-input-dialog v-else-if="item?.template && item.template === 'template-file-input'" />
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
