import { MOUSEBUTTON_LEFT, type HandleEventCallback } from "playcanvas";
import type { CameraActor } from "../actors/CameraActor";
import { SceneActor } from "../actors/SceneActor";

export class CameraInput extends SceneActor {
  camera?: CameraActor;

  private readonly panSpeedScalar = 0.01;

  init(): this {
    const app = this.scene.app;

    app.mouse.on("mousemove", this.onMouseMove());
    return super.init();
  }

  private onMouseMove(): HandleEventCallback {
    const app = this.scene.app;
    return (evt) => {
      if (app.mouse.isPressed(MOUSEBUTTON_LEFT)) {
        this.simplePan(evt.dx, evt.dy);
      }
    };
  }

  private simplePan(dx: number, dy: number) {
    if (dx && dy) {
      const pos = this.camera?.entity?.getPosition();
      if (pos) {
        pos.x -= dx * this.panSpeedScalar;
        pos.y += dy * this.panSpeedScalar;
        this.camera?.entity?.setPosition(pos);
      }
    }
  }
}
