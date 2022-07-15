import type { Transform } from "@/shared/Transform";

export interface ViewerCommands {
  focusOnEntity: () => void;
  getTransform: () => Transform;
  updateTransform: (transform: Transform) => void;
  loadFromFile: (file: File) => Promise<void>;
}
