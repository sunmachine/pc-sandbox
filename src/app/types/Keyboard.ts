import type { Direction } from "./Direction";

export interface KeyMapping {
  key: number;
  direction?: Direction;
  callback?: () => void;
}
