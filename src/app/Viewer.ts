import * as pc from "playcanvas";
import { Camera } from "./actors/Camera";
import { Compass } from "./actors/Compass";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { ModelContainer } from "./actors/ModelContainer";
import { Skybox } from "./skybox/Skybox";

export function focusOnEntity() {
  const camera = Viewer["instance"].camera;
  if (camera) {
    camera.focusOnEntity();
  }
}

export class Viewer {
  camera?: Camera;

  get app(): pc.Application {
    if (this.#app) return this.#app;
    throw new Error("This application is not initialized.");
  }

  static get app(): pc.Application {
    return Viewer.instance.app;
  }

  #app?: pc.Application;
  private static instance: Viewer;

  constructor() {
    Viewer.instance = this;
  }

  initialize(canvas: Element) {
    this.setupApp(canvas);
    this.setupScene();
  }

  start(): void {
    this.app.start();
  }

  private setupApp(canvas: Element) {
    this.#app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      mouse: new pc.Mouse(canvas),
      keyboard: new pc.Keyboard(window),
    });

    this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    this.app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => this.app.resizeCanvas());
  }

  private setupScene() {
    const root = Viewer.app.root;

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    Viewer.app.scene.skybox = skybox;
    Viewer.app.scene.envAtlas = envAtlas;

    // Create base actors.
    this.camera = new Camera(root);
    new Light(root);
    new Grid(root);
    new Compass(root, this.camera);

    const file = {
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
      filename: "DamagedHelmet.glb",
    };

    new ModelContainer(root).loadGltf(file, (entity) =>
      camera.focusOnEntity(entity)
    );
  }
}
