import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class CameraActor extends SceneActor {
  init(): this {
    const camera = new pc.Entity("camera");
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.1, 0.1, 0.1),
    });

    this.parent?.addChild(camera);
    camera.setPosition(0, 1, 3);
    camera.lookAt(0, 0, 0);

    this.entity = camera;
    return super.init();
  }
}
