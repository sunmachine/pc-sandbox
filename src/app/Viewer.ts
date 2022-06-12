import * as pc from "playcanvas";
import { Camera } from "./actors/Camera";
import { Compass } from "./actors/Compass";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { ModelContainer } from "./actors/ModelContainer";
import { SpinningCube } from "./actors/SpinningCube";
import { Skybox } from "./skybox/Skybox";

export class Viewer {
  private readonly functionMap = new Map<string, () => void>();

  initialize(canvas: Element) {
    this.setupApp(canvas);
    this.setupScene();
  }

  start(): void {
    if (pc.app === undefined) {
      console.error("Cannot start yet. Remember to initialize the Viewer.");
    } else {
      pc.app.start();
    }
  }

  getFunction(name: string) {
    return this.functionMap.get(name);
  }

  private setupApp(canvas: Element) {
    const app = new pc.Application(canvas, {
      elementInput: new pc.ElementInput(canvas),
      mouse: new pc.Mouse(canvas),
      keyboard: new pc.Keyboard(window),
    });

    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    window.addEventListener("resize", () => app.resizeCanvas());
  }

  private setupScene() {
    const root = pc.app.root;

    // Setup Skybox.
    const { envAtlas, skybox } = new Skybox().generate();
    pc.app.scene.skybox = skybox;
    pc.app.scene.envAtlas = envAtlas;

    // Create base actors.
    const camera = new Camera(root);
    new Light(root);
    new Grid(root);
    new Compass(root, camera);

    /** Register functions */
    this.functionMap.set("focusOnEntity", () => camera.focusOnEntity());

    const file = {
      url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
      filename: "DamagedHelmet.glb",
    };

    new ModelContainer(root).loadGltf(file, (entity) =>
      camera.focusOnEntity(entity)
    );
  }
}
