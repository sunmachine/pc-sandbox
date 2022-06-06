import { Viewer } from "../Viewer";
export interface Actor {
  entity: pc.Entity;
  update?(dt: number): void;
}

export abstract class Actor {
  constructor(protected root: pc.Entity) {
    if (this.update) {
      Viewer.app.on("update", (dt) => this.update && this.update(dt));
    }
  }
}
