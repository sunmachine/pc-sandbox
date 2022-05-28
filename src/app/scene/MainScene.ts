import { CameraActor } from "../actors/CameraActor";
import { LightActor } from "../actors/LightActor";
import { SpinningCubeActor } from "../actors/SpinningCubeActor";
import { Scene } from "./Scene";

export class MainScene extends Scene {
  init() {
    const root = this.app.root;
    new CameraActor(this.app, root).init();
    new LightActor(this.app, root).init();
    new SpinningCubeActor(this.app, root).init();
  }
}
