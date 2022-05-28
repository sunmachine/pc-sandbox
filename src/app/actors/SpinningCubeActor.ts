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
      this.box.rotate(1.0 * dt, 2.0 * dt, 3.0 * dt);
    }
  }
}
