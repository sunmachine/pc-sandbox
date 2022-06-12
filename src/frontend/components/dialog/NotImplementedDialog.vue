<script setup lang="ts">
import { ref } from "vue";

const dialog = ref(false);
</script>

<template>
  <v-dialog v-model="dialog" activator="parent" rounded scrim="#FF00FF">
    <v-card>
      <v-card-text>This isn't implemented yet.</v-card-text>
      <v-card-actions>
        <v-btn block @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
