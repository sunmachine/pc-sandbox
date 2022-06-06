import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class Camera extends Actor {
  init(): this {
    const camera = new pc.Entity("camera");
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.15, 0.15, 0.15),
    });

    this.root?.addChild(camera);

    this.entity = camera;
    return super.init();
  }
}
