import * as pc from "playcanvas";
import type { Radian as Radians } from "./Radians";
import type { Vector3 } from "./Vectors";
import type { Vectorlike } from "./Vectorlike";

export interface SphericalCoords extends Vectorlike<SphericalCoords> {
  radius: number;
  polar: Radians; // Phi in physics standard.
  elevation: Radians; // Theta in phyiscs standard.

  copy(rhs: SphericalCoords): this;
  lerp(lhs: SphericalCoords, rhs: SphericalCoords, t: number): this;
}

export class SphericalCoords {
  constructor(
    public radius: number,
    public polar: Radians,
    public elevation: Radians
  ) {}

  copy(rhs: SphericalCoords): this {
    this.radius = rhs.radius;
    this.polar = rhs.polar;
    this.elevation = rhs.elevation;
    return this;
  }

  lerp(lhs: SphericalCoords, rhs: SphericalCoords, t: number): this {
    this.radius = lhs.radius + t * (rhs.radius - lhs.radius);
    this.polar = lhs.polar + t * (rhs.polar - lhs.polar);
    this.elevation = lhs.elevation + t * (rhs.elevation - lhs.elevation);
    return this;
  }

  toCartesian(outVec?: Vector3): Vector3 {
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
  const x = vec.x === 0 ? Number.EPSILON : vec.x;
  const y = vec.y;
  const z = vec.z;

  const radius = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  let polar = Math.atan(z / x);
  if (x < 0) polar += Math.PI;

  const elevation = Math.asin(y / radius);

  if (outCoords) {
    outCoords.elevation = elevation;
    outCoords.polar = polar;
    outCoords.radius = radius;
    return outCoords;
  }

  return new SphericalCoords(radius, polar, elevation);
}
