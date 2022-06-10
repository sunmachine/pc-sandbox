import { math } from "playcanvas";

export type Radians = number;
export type Degrees = number;

export function degToRad(degrees: number) {
  return degrees * math.DEG_TO_RAD;
}

export function radToDeg(radians: Radians) {
  return radians * math.RAD_TO_DEG;
}
