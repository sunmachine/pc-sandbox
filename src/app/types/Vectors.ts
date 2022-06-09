import type * as pc from "playcanvas";
import type { Vectorlike } from "./Vectorlike";

export type Vector2 = pc.Vec2 & Vectorlike<pc.Vec2>;
export type Vector3 = pc.Vec3 & Vectorlike<pc.Vec3>;
export type Vector4 = pc.Vec4 & Vectorlike<pc.Vec4>;
