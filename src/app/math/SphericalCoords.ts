import * as pc from "playcanvas";
import type { Radian as Radians } from "./Radians";
import type { Vector3 } from "./Vectors";

export interface SphericalCoords {
  radius: number;
  polar: Radians; // Phi in physics standard.
  elevation: Radians; // Theta in phyiscs standard.
}

export class SphericalCoords {
  constructor(
    public radius: number,
    public polar: Radians,
    public elevation: Radians
  ) {}

  public toCartesian(outVec?: Vector3): Vector3 {
    return sphericalToCartesian(
      this.radius,
      this.polar,
      this.elevation,
      outVec
    );
  }
}

export function sphericalToCartesian(
  radius: number,
  polar: Radians,
  elevation: Radians,
  outVec?: Vector3
): Vector3 {
  const vec = outVec ?? new pc.Vec3();

  const a = radius * Math.cos(elevation);
  vec.x = a * Math.cos(polar);
  vec.y = radius * Math.sin(elevation); // (Z) Swapped for Y-up coordinate system.
  vec.z = a * Math.sin(polar); // (Y) Swapped for Y-up coordinate system.

  return vec;
}

export function cartesianToSpherical(
  vec: Vector3,
  outCoords?: SphericalCoords
): SphericalCoords {
  if (vec.x == 0) vec.x = Number.EPSILON;

  const radius = Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);

  let polar = Math.atan(vec.z / vec.x);
  if (vec.x < 0) polar += Math.PI;

  const elevation = Math.asin(vec.y / radius);

  if (outCoords) {
    outCoords.elevation = elevation;
    outCoords.polar = polar;
    outCoords.radius = radius;
    return outCoords;
  }

  return new SphericalCoords(radius, polar, elevation);
}
