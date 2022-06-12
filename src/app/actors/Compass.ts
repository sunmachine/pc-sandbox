import type { CameraComponent } from "playcanvas";
import * as pc from "playcanvas";
import { Actor } from "./Actor";
import type { Camera } from "./Camera";

export class Compass extends Actor {
  private _camera: Camera;

  private readonly colors = {
    x: new pc.Color().fromString("#f44040"),
    y: new pc.Color().fromString("#8dc56c"),
    z: new pc.Color().fromString("#3747f0"),
  };
  private readonly scale = 0.05;
  private readonly padding = { x: -12, y: 0 };

  readonly #start = new pc.Vec3();
  readonly #end = new pc.Vec3();
  readonly #center = new pc.Vec3().copy(pc.Vec3.ZERO);
  readonly #direct = new pc.Vec3().copy(pc.Vec3.ZERO);

  constructor(root: pc.Entity, camera: Camera) {
    super(root);
    this._camera = camera;

    const cam = camera.entity.camera;
    if (!cam) throw new Error("Cannot find the CameraComponent.");
    this.entity = camera.entity;
  }

  update(dt: number) {
    this.render();
  }

  private render() {
    const cam = this.entity.camera;
    if (!cam) return;

    // Hard-coded, position the compass at "90%" of screen height.
    const p = 0.9;
    const cW = pc.app.graphicsDevice.width;
    const cH = pc.app.graphicsDevice.height;

    // Determine screen positions.
    let x = cH * (1 - p);
    const y = cW - x + this.padding.x;
    x += this.padding.y;

    // Term ensures the compass remains the same size
    //  on the screen despite reprojection.
    const d = this._camera.cameraCoords.value.radius * this.scale;

    this.drawLine(
      cam,
      y,
      x,
      this.#direct.copy(pc.Vec3.RIGHT).mulScalar(d),
      this.colors.x
    );
    this.drawLine(
      cam,
      y,
      x,
      this.#direct.copy(pc.Vec3.UP).mulScalar(d),
      this.colors.y
    );
    this.drawLine(
      cam,
      y,
      x,
      this.#direct.copy(pc.Vec3.FORWARD).mulScalar(d),
      this.colors.z
    );
  }

  private drawLine(
    cam: CameraComponent,
    offsetW: number,
    offsetH: number,
    vec: pc.Vec3,
    color: pc.Color
  ) {
    const center = this._camera.focus.value;
    cam.worldToScreen(this.#center.copy(center), this.#start);
    cam.worldToScreen(this.#center.add(vec), this.#end);

    // Get deltas of the start and end points,
    // then reproject to desired location on viewport.
    const dx = this.#end.x - this.#start.x;
    const dy = this.#end.y - this.#start.y;
    const ax = offsetW;
    const ay = offsetH;
    const bx = offsetW + dx;
    const by = offsetH + dy;

    cam?.screenToWorld(ax, ay, 1, this.#start);
    cam?.screenToWorld(bx, by, 1, this.#end);

    pc.app.drawLine(this.#start, this.#end, color, false);
  }
}
