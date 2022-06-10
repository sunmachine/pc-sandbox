import * as pc from "playcanvas";
import { Camera } from "./actors/Camera";
import { Compass } from "./actors/Compass";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { ModelContainer } from "./actors/ModelContainer";
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
      keyboard: new pc.Keyboard(window),
    });

    Viewer.#app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    Viewer.#app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => Viewer.#app.resizeCanvas());
  }

  private setupScene() {
    const root = Viewer.app.root;

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    Viewer.app.scene.skybox = skybox;
    Viewer.app.scene.envAtlas = envAtlas;

    // Create base actors.
    const camera = new Camera(root);
    new Light(root);
    new Grid(root);
    new Compass(root, camera);

    const file = {
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
      filename: "DamagedHelmet.glb",
    };

    new ModelContainer(root).loadGltf(file, (entity) =>
      camera.focusOnEntity(entity)
    );
  }
}
