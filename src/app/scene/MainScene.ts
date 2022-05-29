import * as pc from "playcanvas";
import { CameraActor } from "../actors/CameraActor";
import { GroundPlaneActor } from "../actors/GroundPlaneActor";
import { LightActor } from "../actors/LightActor";
import { SpinningCubeActor } from "../actors/SpinningCubeActor";
import { CameraInput } from "../inputs/CameraInput";
import { Scene } from "./Scene";

export class MainScene extends Scene {
  init() {
    // Dependencies
    const root = this.app.root;
    const defaultMaterial = new pc.StandardMaterial();

    // Create base scene actors.
    const camera = new CameraActor(this, root).init();
    new LightActor(this, root).init();
    new SpinningCubeActor(this, root).init(defaultMaterial);
    new GroundPlaneActor(this, root).init(defaultMaterial);

    // Handle scene inputs.
    const cameraInput = new CameraInput(this, root).init();
    cameraInput.camera = camera;
  }
}
