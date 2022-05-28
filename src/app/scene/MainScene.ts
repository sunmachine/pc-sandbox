import { CameraActor } from "../actors/CameraActor";
import { LightActor } from "../actors/LightActor";
import { SpinningCubeActor } from "../actors/SpinningCubeActor";
import { CameraInput } from "../inputs/CameraInput";
import { Scene } from "./Scene";

export class MainScene extends Scene {
  init() {
    const root = this.app.root;

    // Create base scene actors.
    const camera = new CameraActor(this.app, root).init();
    new LightActor(this.app, root).init();
    new SpinningCubeActor(this.app, root).init();

    // Handle scene inputs.
    const cameraInput = new CameraInput(this.app, root).init();
    cameraInput.camera = camera;
  }
}
