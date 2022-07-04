<script setup lang="ts">
import { ref } from "vue";

const dialog = ref(false);
const loading = ref(false);
const props = defineProps<{
  callback: (files: FileList) => Promise<void>;
}>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function onFileSelected(e: any): Promise<void> {
  const files = e.target?.files;
  if (files && files instanceof FileList) {
    loading.value = true;
    if (props.callback) await props.callback(files);
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
