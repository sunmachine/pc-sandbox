import * as pc from "playcanvas";
import { Viewer } from "../Viewer";
import { Actor } from "./Actor";

export class GroundPlaneActor extends Actor<pc.Material> {
  private readonly _planeOpts = {
    halfExtents: new pc.Vec2(4.0, 4.0),
    widthSegments: 8,
    lengthSegments: 8,
    calculateTangents: true,
  };

  init(material: pc.Material): this {
    const plane = new pc.Entity("plane");

    const mesh = pc.createPlane(Viewer.app.graphicsDevice, this._planeOpts);
    const meshInstance = new pc.MeshInstance(mesh, material);

    plane.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.root?.addChild(plane);
    plane.setPosition(0, -1, 0);

    this.entity = plane;
    return super.init(material);
  }
}
