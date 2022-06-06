import * as pc from "playcanvas";
import { Camera } from "./actors/Camera";
import { Light } from "./actors/Light";
import type { Actor } from "./actors/Actor";
import { SpinningCube } from "./actors/SpinningCube";
import { Skybox } from "./skybox/Skybox";

export class Viewer {
  static #app: pc.Application;
  static get app(): pc.Application {
    return Viewer.#app;
  }

  protected actors: Array<Actor> = [];

  constructor(canvas: Element) {
    Viewer.#app = this.setupApp(canvas);
    this.setupScene();
  }

  start(): void {
    Viewer.app.start();
  }

  private setupApp(canvas: Element): pc.Application {
    const app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      mouse: new pc.Mouse(canvas),
      touch: "ontouchstart" in window ? new pc.TouchDevice(canvas) : undefined,
      keyboard: new pc.Keyboard(window),
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => app.resizeCanvas());

    return app;
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
    new SpinningCube(root, defaultMaterial);
  }
}
