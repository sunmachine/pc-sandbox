import { defineStore } from "pinia";

type Vector3 = [number, number, number];

export const useTransformStore = defineStore("transform", {
  state: () => ({
    position: [0, 0, 0] as Vector3,
    rotation: [0, 0, 0] as Vector3,
    scale: [0, 0, 0] as Vector3,
  }),
  getters: {
    getStateDataByIndex: (state) => (index: number) => {
      switch (index) {
        case 0:
          return state.position;
        case 1:
          return state.rotation;
        case 2:
          return state.scale;
        default:
          throw new Error("Invalid index value provided.");
      }
    },
  },
  actions: {
    setPositionAtIndex(index: number, value: number) {
      this.position[index] = value;
    },
    setRotationAtIndex(index: number, value: number) {
      this.rotation[index] = value;
    },
    setScaleAtIndex(index: number, value: number) {
      this.scale[index] = value;
    },
  },
});
