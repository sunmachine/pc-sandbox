<script setup lang="ts">
import { useTransformStore } from '@/frontend/hooks/transform';

const vecSize = 3;
const rowLabels = ["Position", "Rotation", "Scale"];
const axisLabels = ["X", "Y", "Z"];

const store = useTransformStore();
function getInputId(i: number, j: number) {
  return `transform-input-${i}-${j}`;
};
</script>

<template>
  <v-container class="pt-2 pb-0">
    <v-spacer />
    <v-row dense v-for="(_, i) in vecSize" class="d-sm-flex">
      <v-col class="pa-0">
        <p class="text-subtitle-2 align-center text-left pt-3">{{ rowLabels[i] }}</p>
      </v-col>
      <v-col class="pb-2" v-for="(_, j) in vecSize">
        <v-text-field :id="getInputId(i, j)" :v-model="store.getStateDataByIndex(i)[j]" :label=axisLabels[j]
          v-model.number="store.getStateDataByIndex(i)[j]" persistent-placeholder hide-details variant="outlined"
          density="compact" type="number" />
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
</style>