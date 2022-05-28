export interface SceneActor {
  entity?: pc.Entity;
  init(): this;
  update?(dt: number): void;
}

export abstract class SceneActor {
  constructor(protected app: pc.Application, protected parent: pc.Entity) {}

  init(): this {
    this.app.on("update", (dt) => {
      if (this.update !== undefined) {
        this.update(dt);
      }
    });

    return this;
  }
}
