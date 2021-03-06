import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class Light extends Actor {
  constructor(root: pc.Entity) {
    super(root);

    const light = new pc.Entity("light");
    light.addComponent("light");
    this.root.addChild(light);
    light.setEulerAngles(45, 0, 0);

    this.entity = light;
  }
}
