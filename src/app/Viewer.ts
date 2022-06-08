import * as pc from "playcanvas";
import { Camera } from "./actors/Camera";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { SpinningCube } from "./actors/SpinningCube";
import { Skybox } from "./skybox/Skybox";

export class Viewer {
  static #app: pc.Application;
  static get app(): pc.Application {
    return Viewer.#app;
  }

  constructor(canvas: Element) {
    this.setupApp(canvas);
    this.setupScene();
  }

  start(): void {
    Viewer.#app.start();
  }

  private setupApp(canvas: Element) {
    Viewer.#app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      mouse: new pc.Mouse(canvas),
      touch: "ontouchstart" in window ? new pc.TouchDevice(canvas) : undefined,
      keyboard: new pc.Keyboard(window),
    });

    Viewer.#app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    Viewer.#app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => Viewer.#app.resizeCanvas());
  }

  private setupScene() {
    const root = Viewer.app.root;
    const defaultMaterial = new pc.StandardMaterial();

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    Viewer.app.scene.skybox = skybox;
    Viewer.app.scene.envAtlas = envAtlas;

    // Create base actors.
    new Camera(root);
    new Light(root);
    new Grid(root);
    new SpinningCube(root, defaultMaterial);
  }
}
