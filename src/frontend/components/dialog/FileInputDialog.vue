<script setup lang="ts">
import type { Viewer } from "@/app/Viewer";
import { inject, ref } from "vue";

const dialog = ref(false);
const loading = ref(false);

const viewer = inject<Viewer>("viewer");
const loadFromFile = async (file: File) => {
  const func = viewer?.getFunction("loadFromFile");
  if (func) func(file);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onFileSelected(e: any): Promise<void> {
  const files = e.target?.files;
  if (files && files instanceof FileList) {
    loading.value = true;

    // TODO: Just grab the first file.
    const file = files[0];
    if (file) await loadFromFile(file);
  } else {
    // Throw error.
    console.error("No files in list.");
  }

  loading.value = false;
  dialog.value = false;
}
</script>

<template>
  <v-dialog v-model="dialog" activator="parent" rounded scrim="#222222">
    <v-card min-width="400">
      <v-card-text>
        <v-file-input
          class="ma-2"
          id="fileInput"
          ref="fileInput"
          :loading="loading"
          accept="model/gltf-binary, .glb"
          placeholder="Select a gltf model & assets."
          prepend-icon="mdi-cube"
          label="Load from disk..."
          multiple
          @change="onFileSelected"
        ></v-file-input>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
