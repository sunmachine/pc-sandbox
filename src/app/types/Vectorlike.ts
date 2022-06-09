export type Vectorlike<T> = Copyable<T> & Lerpable<T>;

export interface Copyable<T> {
  copy(rhs: T): T;
}

export interface Lerpable<T> {
  lerp(lhs: T, rhs: T, t: number): T;
}
