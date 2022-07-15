<script setup lang="ts">
import Transforms from "./Transforms.vue";
</script>

<template>
  <div class="ui rounded-lg">
    <v-expansion-panels>
      <v-expansion-panel variant="accordian" title="Transform">
        <v-expansion-panel-text>
          <Transforms />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
.ui {
  position: absolute;
  bottom: 1rem;
  right: 1rem;

  width: 460px;

  padding: 0.33em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 0.33em;

  background-color: rgb(var(--v-theme-background));
}
</style>