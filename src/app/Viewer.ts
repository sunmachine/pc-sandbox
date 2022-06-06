import * as pc from "playcanvas";
import { CameraActor } from "./actors/CameraActor";
import { LightActor } from "./actors/LightActor";
import type { SceneActor } from "./actors/SceneActor";
import { SpinningCubeActor } from "./actors/SpinningCubeActor";
import { CameraInput } from "./inputs/CameraInput";
import { Skybox } from "./skybox/Skybox";

export class Viewer {
  protected actors: Array<SceneActor> = [];

  constructor(canvas: Element) {
    this.setupApp(canvas);
    this.setupScene();
  }

  start(): void {
    app.start();
  }

  private setupApp(canvas: Element) {
    app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      mouse: new pc.Mouse(canvas),
      touch: "ontouchstart" in window ? new pc.TouchDevice(canvas) : undefined,
      keyboard: new pc.Keyboard(window),
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => app.resizeCanvas());
  }

  private setupScene() {
    const root = app.root;
    const defaultMaterial = new pc.StandardMaterial();

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    app.scene.skybox = skybox;
    app.scene.envAtlas = envAtlas;

    // Create base scene actors.
    const camera = new CameraActor(root).init();
    new LightActor(root).init();
    new SpinningCubeActor(root).init(defaultMaterial);

    // Handle scene inputs.
    new CameraInput(root).init(camera);
  }
}
