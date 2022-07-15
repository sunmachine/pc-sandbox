<script setup lang="ts">

const rows = ["Position", "Scale", "Rotation"];
const axes = ["X", "Y", "Z"];
</script>

<template>
  <v-container class="pt-2 pb-0">
    <v-spacer />
    <v-row dense v-for="inputLabel in rows" class="d-sm-flex">
      <v-col class="pa-0">
        <p class="text-subtitle-2 align-center text-left pt-3">{{ inputLabel }}</p>
      </v-col>
      <v-col class="pb-2" v-for="axisLabel in axes">
        <v-text-field 
          density="compact" 
          :label=axisLabel 
          placeholder=0 
          persistent-placeholder 
          hide-details
          variant="outlined"
          type="number" />
      </v-col>
    </v-row>
  </v-container>

</template>

<style scoped>
</style>