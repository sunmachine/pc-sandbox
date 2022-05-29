import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class SpinningCubeActor extends SceneActor<pc.Material> {
  box?: pc.Entity;

  private readonly _cubeOpts = {
    halfExtents: new pc.Vec3(0.5, 0.1, 0.5),
    widthSegments: 2,
    lengthSegments: 2,
    heightSegments: 2,
    calculateTangents: true,
  };

  init(material: pc.Material): this {
    const app = this.scene.app;
    this.box = new pc.Entity("cube");

    const mesh = pc.createBox(app.graphicsDevice, this._cubeOpts);
    const meshInstance = new pc.MeshInstance(mesh, material);

    this.box.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.parent.addChild(this.box);

    return super.init(material);
  }

  update(dt: number): void {
    if (this.box) {
      this.box.rotate(1.0 * dt, 2.0 * dt, 3.0 * dt);
    }
  }
}
