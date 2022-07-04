<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { inject, ref } from "vue";
import NotImplementedDialog from "../dialog/NotImplementedDialog.vue";
import FileInputDialog from "../dialog/FileInputDialog.vue";

interface ToolbarItems {
  id: number;
  icon: string;
  template?: string;
  callback?: (...args: unknown[]) => void;
}

const viewer = inject<Viewer>("viewer");
const getFunc = (name: string, ...args: unknown[]) => {
  const func = viewer?.getFunction(name);
  if (func) func(args);
};

const toolbarItems = ref([
  {
    id: 0,
    // https://materialdesignicons.com/
    icon: "mdi-image-filter-center-focus",
    callback: () => getFunc("focusOnEntity"),
  },
  {
    id: 1,
    icon: "mdi-folder-open",
    template: "template-file-input",
    callback: (files: FileList) => {
      getFunc("loadModel", files);
    },
  },
] as Array<ToolbarItems>);
</script>

<template>
  <div class="ui rounded-lg">
    <div v-for="item in toolbarItems" :key="item.id">
      <v-btn
        ref="hudButton"
        class="ui-button"
        icon
        rounded="lg"
        @click="() => !item?.template && item?.callback && item.callback()"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <not-implemented-dialog
          v-if="item.template === 'template-not-implemented'"
        />
        <file-input-dialog
          v-else-if="item?.template && item.template === 'template-file-input'"
          :callback="async (files: FileList) => item.callback && item.callback(files)"
        />
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
