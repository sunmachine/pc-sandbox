import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class SpinningCube extends Actor {
  private readonly _cubeOpts = {
    halfExtents: new pc.Vec3(0.5, 0.1, 0.5),
    widthSegments: 2,
    lengthSegments: 2,
    heightSegments: 2,
    calculateTangents: true,
  };

  constructor(root: pc.Entity, material: pc.Material) {
    super(root);

    const cube = new pc.Entity("cube");
    const mesh = pc.createBox(pc.app.graphicsDevice, this._cubeOpts);
    const meshInstance = new pc.MeshInstance(mesh, material);

    cube.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.root.addChild(cube);
    cube.setPosition(0, 0, 0);

    this.entity = cube;
  }

  update(dt: number): void {
    this.entity.rotate(1.0 * dt, 2.0 * dt, 3.0 * dt);
  }
}
