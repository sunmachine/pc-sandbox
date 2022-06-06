import * as pc from "playcanvas";
import { Viewer } from "../Viewer";
import { Actor } from "./Actor";

export class GroundPlaneActor extends Actor {
  private readonly _planeOpts = {
    halfExtents: new pc.Vec2(4.0, 4.0),
    widthSegments: 8,
    lengthSegments: 8,
    calculateTangents: true,
  };

  constructor(root: pc.Entity, material: pc.Material) {
    super(root);

    const plane = new pc.Entity("plane");
    const mesh = pc.createPlane(Viewer.app.graphicsDevice, this._planeOpts);
    const meshInstance = new pc.MeshInstance(mesh, material);

    plane.addComponent("render", {
      meshInstances: [meshInstance],
    });
    root.addChild(plane);
    plane.setPosition(0, -1, 0);

    this.entity = plane;
  }
}
