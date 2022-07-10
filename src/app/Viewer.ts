import * as pc from "playcanvas";
import type { Actor } from "./actors/Actor";
import { Camera } from "./actors/Camera";
import { Compass } from "./actors/Compass";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { ModelContainer } from "./actors/ModelContainer";
import { Water } from "./actors/water/Water";
import { Skybox } from "./skybox/Skybox";

type CallbackFunc = (_arg?: unknown) => Promise<void> | void;

export class Viewer {
  private readonly functionMap = new Map<string, CallbackFunc>();
  private actors = new Map<string, Actor>();

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

    // Setup rendering layers.
    // Assumes World's transparent layer is on index 3.
    const layerComp = pc.app.scene.layers as pc.LayerComposition;
    const waterVolume = new pc.Layer({
      name: "WaterVolume",
      opaqueSortMode: pc.SORTMODE_NONE,
      transparentSortMode: pc.SORTMODE_BACK2FRONT,
    });
    const waterSurface = new pc.Layer({
      name: "WaterSurface",
      opaqueSortMode: pc.SORTMODE_NONE,
      transparentSortMode: pc.SORTMODE_BACK2FRONT,
    });

    layerComp.insertTransparent(waterVolume, 3);
    layerComp.insertTransparent(waterSurface, 4);

    // Create base actors.
    const camera = new Camera(root);
    this.actors.set("light", new Light(root));
    this.actors.set("grid", new Grid(root));
    this.actors.set("camera", new Compass(root, camera));

    // Assign camera rendering layers.
    if (camera.entity.camera) {
      const updatedLayers = new Array<number>(...camera.entity.camera.layers);
      updatedLayers.push(waterVolume.id);
      updatedLayers.push(waterSurface.id);
      camera.entity.camera.layers = updatedLayers;
    }

    const water = new Water(root);
    this.actors.set("model", water);
    camera.focusOnEntity(water.entity);

    /** Register functions */
    this.functionMap
      .set("focusOnEntity", () => camera.focusOnEntity())
      .set("loadFromFile", (arg: unknown) => {
        const file = arg as File;
        if (!file) return;

        const model = this.actors.get("model");
        if (model) {
          model.entity?.destroy();
          this.actors.delete("model");
        }

        const container = new ModelContainer(root);
        container.loadGltf(file).then((entity) => {
          camera.focusOnEntity(entity);
          this.actors.set("model", container);
        });
      });
  }
}
