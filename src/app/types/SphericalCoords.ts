import * as pc from "playcanvas";
import type { Radians as Radians } from "./Radians";
import type { Vector3 } from "./Vectors";
import type { Vectorlike } from "./Vectorlike";

export interface SphericalCoords extends Vectorlike<SphericalCoords> {
  radius: number;
  polar: Radians; // Phi in physics standard. Theta in math.
  elevation: Radians; // Theta in phyiscs standard. Phi in math.

  copy(rhs: SphericalCoords): this;
  lerp(lhs: SphericalCoords, rhs: SphericalCoords, t: number): this;
}

export class SphericalCoords {
  radius: number;
  polar: Radians;
  elevation: Radians;

  constructor(radius?: number, polar?: Radians, elevation?: Radians) {
    this.radius = radius ?? 0;
    this.polar = polar ?? 0;
    this.elevation = elevation ?? 0;
  }

  clone(): SphericalCoords {
    return new SphericalCoords().copy(this);
  }

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
    return SphericalCoords.toCartesian(
      this.radius,
      this.polar,
      this.elevation,
      outVec
    );
  }

  static toCartesian(
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

  static fromCartesian(
    vec: Vector3,
    outCoords?: SphericalCoords
  ): SphericalCoords {
    const coords = outCoords ?? new SphericalCoords();

    const x = vec.x === 0 ? Number.EPSILON : vec.x;
    const y = vec.y;
    const z = vec.z;

    const radius = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    let polar = Math.atan(z / x);
    if (x < 0) polar += Math.PI;

    const elevation = Math.asin(y / radius);

    coords.radius = radius;
    coords.polar = polar;
    coords.elevation = elevation;
    return coords;
  }
}
