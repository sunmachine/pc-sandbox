import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class LightActor extends Actor {
  init(): this {
    const light = new pc.Entity("light");
    light.addComponent("light");
    this.root?.addChild(light);
    light.setEulerAngles(45, 0, 0);

    this.entity = light;
    return super.init();
  }
}
