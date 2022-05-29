import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class SpinningCubeActor extends SceneActor<pc.Material> {
  private readonly _cubeOpts = {
    halfExtents: new pc.Vec3(0.5, 0.1, 0.5),
    widthSegments: 2,
    lengthSegments: 2,
    heightSegments: 2,
    calculateTangents: true,
  };

  init(material: pc.Material): this {
    const app = this.scene.app;
    const cube = new pc.Entity("cube");

    const mesh = pc.createBox(app.graphicsDevice, this._cubeOpts);
    const meshInstance = new pc.MeshInstance(mesh, material);

    cube.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.parent.addChild(cube);
    cube.setPosition(0, 0, 0);

    this.entity = cube;
    return super.init(material);
  }

  update(dt: number): void {
    if (this.entity) {
      this.entity.rotate(1.0 * dt, 2.0 * dt, 3.0 * dt);
    }
  }
}
