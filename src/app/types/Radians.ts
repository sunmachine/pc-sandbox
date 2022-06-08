import { math } from "playcanvas";

export type Radian = number;
export type Degrees = number;

export function degToRad(degrees: number) {
  return degrees * math.DEG_TO_RAD;
}

export function radToDeg(radians: Radian) {
  return radians * math.RAD_TO_DEG;
}
