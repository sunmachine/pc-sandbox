import * as pc from "playcanvas";
import { SceneActor } from "./SceneActor";

export class SpinningCubeActor extends SceneActor {
  box?: pc.Entity;

  init(): this {
    this.box = new pc.Entity("cube");
    this.box.addComponent("model", {
      type: "box",
    });
    this.parent.addChild(this.box);

    return super.init();
  }

  update(dt: number): void {
    if (this.box) {
      this.box.rotate(10.0 * dt, 20.0 * dt, 30.0 * dt);
    }
  }
}
