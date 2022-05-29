import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class LightActor extends SceneActor {
  init(): this {
    const light = new pc.Entity("light");
    light.addComponent("light");
    this.parent?.addChild(light);
    light.setEulerAngles(45, 0, 0);

    this.entity = light;
    return super.init();
  }
}
