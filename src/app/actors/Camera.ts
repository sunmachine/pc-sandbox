import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class Camera extends Actor {
  constructor(root: pc.Entity) {
    super(root);

    const camera = new pc.Entity("camera");
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.15, 0.15, 0.15),
    });

    root.addChild(camera);
    this.entity = camera;
  }
}
