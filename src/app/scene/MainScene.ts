import * as pc from "playcanvas";
import { CameraActor } from "../actors/CameraActor";
import { LightActor } from "../actors/LightActor";
import { SpinningCubeActor } from "../actors/SpinningCubeActor";
import { CameraInput } from "../inputs/CameraInput";
import { Skybox } from "../skybox/Skybox";
import { Scene } from "./Scene";

export class MainScene extends Scene {
  init() {
    // Dependencies
    const root = app.root;
    const defaultMaterial = new pc.StandardMaterial();

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    this.scene.skybox = skybox;
    this.scene.envAtlas = envAtlas;

    // Create base scene actors.
    const camera = new CameraActor(this, root).init();
    new LightActor(this, root).init();
    new SpinningCubeActor(this, root).init(defaultMaterial);

    // Handle scene inputs.
    new CameraInput(this, root).init(camera);
  }
}
