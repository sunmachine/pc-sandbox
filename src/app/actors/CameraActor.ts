import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class CameraActor extends SceneActor {
  init(): this {
    const camera = new pc.Entity("camera");
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.15, 0.15, 0.15),
    });

    this.parent?.addChild(camera);

    this.entity = camera;
    return super.init();
  }
}
