<script setup lang="ts">
import type { Viewer } from '@/app/Viewer';
import { useTransformStore } from '@/frontend/hooks/transform';
import type { Transform } from '@/shared/Transform';
import { inject } from 'vue';

const vecSize = 3;
const rowLabels = ["Position", "Rotation", "Scale"];
const axisLabels = ["X", "Y", "Z"];

function getInputId(i: number, j: number) {
  return `transform-input-${i}-${j}`;
};

const viewer = inject<Viewer>("viewer");
const store = useTransformStore();

store.$subscribe(
  (_, state) => {
    viewer?.functions.updateTransform({
      position: state.position,
      rotation: state.rotation,
      scale: state.scale
    } as Transform);
  },
  { detached: true });


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