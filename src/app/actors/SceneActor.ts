import type { Scene } from "../scene/Scene";

export interface SceneActor<TInit = undefined> {
  entity?: pc.Entity;
  init(data?: TInit): this;
  update?(dt: number): void;
}

export abstract class SceneActor<TInit = undefined> {
  constructor(protected scene: Scene, protected parent: pc.Entity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(_?: TInit): this {
    this.scene.app.on("update", (dt) => {
      if (this.update !== undefined) {
        this.update(dt);
      }
    });

    return this;
  }
}
