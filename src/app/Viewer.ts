import type { Transform } from "@/shared/Transform";
import * as pc from "playcanvas";
import type { Actor } from "./actors/Actor";
import { Camera } from "./actors/Camera";
import { Compass } from "./actors/Compass";
import { Grid } from "./actors/Grid";
import { Light } from "./actors/Light";
import { ModelContainer } from "./actors/ModelContainer";
import { Water } from "./actors/water/Water";
import { Skybox } from "./skybox/Skybox";
import type { ViewerCommands } from "./types/ViewerCommands";

export class Viewer {
  actors = new Map<string, Actor>();
  functions?: ViewerCommands;

  initialize(canvas: Element) {
    this.setupApp(canvas);
    this.setupScene();
    this.registerFunctions();
  }

  start(): void {
    if (pc.app === undefined) {
      console.error("Cannot start yet. Remember to initialize the Viewer.");
    } else {
      pc.app.start();
    }
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

    // Setup rendering.
    const camera = new Camera(root);
    this.actors.set("camera", camera);
    Water.setupPrerequisites(pc.app.scene, camera.entity.camera);

    // Create base actors.
    this.actors.set("light", new Light(root));
    this.actors.set("grid", new Grid(root));
    this.actors.set("compass", new Compass(root, camera));

    const water = new Water(root);
    this.actors.set("model", water);
    camera.focusOnEntity(water.entity);
  }

  private registerFunctions() {
    const root = pc.app.root;
    const camera = this.actors.get("camera") as Camera;

    this.functions = {
      focusOnEntity: () => camera.focusOnEntity(),
      getTransform: () => {
        const actor = this.actors.get("model");
        if (!actor?.entity) {
          throw new Error(
            `Cannot find registered entity. Unable to get transform: ${actor}`
          );
        }

        const p = actor.entity.getPosition();
        const r = actor.entity.getLocalEulerAngles();
        const s = actor.entity.getLocalScale();
        return {
          position: [p.x, p.y, p.z],
          rotation: [r.x, r.y, r.z],
          scale: [s.x, s.y, s.z],
        } as Transform;
      },
      updateTransform: (transform: Transform) => {
        const actor = this.actors.get("model");
        if (!actor?.entity) {
          throw new Error(
            `Cannot find registered entity. Unable to update transform: ${actor}`
          );
        }

        if (transform?.position) {
          actor.entity.setPosition(...transform.position);
        }
        if (transform?.rotation) {
          actor.entity.setLocalEulerAngles(...transform.rotation);
        }
        if (transform?.scale) {
          actor.entity.setLocalScale(...transform.scale);
        }
      },
      loadFromFile: async (file: File) => {
        const model = this.actors.get("model");
        if (model) {
          model.entity?.destroy();
          this.actors.delete("model");
        }

        const container = new ModelContainer(root);
        return container.loadGltf(file).then((entity) => {
          camera.focusOnEntity(entity);
          this.actors.set("model", container);
        });
      },
    };
  }
}
