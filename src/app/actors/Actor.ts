import { Viewer } from "../Viewer";
export interface Actor<TInit = undefined> {
  entity?: pc.Entity;

  init(data?: TInit): this;
  update?(dt: number): void;
}

export abstract class Actor<TInit = undefined> {
  constructor(protected root?: pc.Entity) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(_?: TInit): this {
    if (this.update) {
      Viewer.app.on("update", (dt) => this.update && this.update(dt));
    }

    return this;
  }
}
