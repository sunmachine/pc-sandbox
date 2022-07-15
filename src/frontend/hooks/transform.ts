import type { Viewer } from "@/app/Viewer";
import { defineStore } from "pinia";
import { inject } from "vue";

export const useTransformStore = () => {
  const viewer = inject<Viewer>("viewer");
  const transform = viewer?.functions?.getTransform();

  console.log(
    "What is the starting transform?",
    viewer,
    viewer?.functions,
    transform
  );

  return defineStore("transform", {
    state: () => ({
      position: transform?.position ?? [0, 0, 0],
      rotation: transform?.rotation ?? [0, 0, 0],
      scale: transform?.scale ?? [0, 0, 0],
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
  })();
};
