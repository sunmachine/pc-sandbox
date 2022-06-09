import type { Vectorlike } from "./Vectorlike";

export class AnimatedVector<T extends Vectorlike<T>> {
  value: T;
  start: T;
  target: T;
  duration: number;
  timer: number;

  constructor(value: T, duration = 0.33) {
    this.value = value.clone();
    this.start = value.clone();
    this.target = value.clone();
    this.duration = duration;
    this.timer = 0;
  }

  goto(target: T) {
    this.timer = 0;
    this.start.copy(this.value);
    this.target.copy(target);
  }

  /** @returns True if an update occured, false if not. */
  update(dt: number): boolean {
    if (this.timer < this.duration) {
      this.timer = Math.min(this.timer + dt, this.duration);
      const n = this.timer / this.duration;
      // const t = Math.sin(n * Math.PI / 2.0);        // sinosidal
      // const t = n * (2 - n);                        // quadratic
      // const t = 1 - --n * n * n * n;                // quartic
      const t = (n - 1) ** 5 + 1; // quintic
      this.value = this.value.lerp(this.start, this.target, t);
      return true;
    }

    this.value.copy(this.target);
    return false;
  }
}
