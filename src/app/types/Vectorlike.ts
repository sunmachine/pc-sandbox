export interface Vectorlike<T> {
  clone(): T;
  copy(rhs: T): T;
  lerp(lhs: T, rhs: T, t: number): T;
}
