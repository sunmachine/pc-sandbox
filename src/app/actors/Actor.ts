import * as pc from "playcanvas";
export interface Actor {
  entity: pc.Entity;
  update?(dt: number): void;
}

export abstract class Actor {
  constructor(protected root: pc.Entity) {
    if (this.update) {
      pc.app.on("update", (dt: number) => this.update && this.update(dt));
    }
  }
}
