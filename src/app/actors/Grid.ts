import * as pc from "playcanvas";
import { Viewer } from "../Viewer";
import { Actor } from "./Actor";

export class Grid extends Actor {
  private readonly size = 10;
  private readonly colors = {
    axis: new pc.Color().fromString("#bbbbbb"),
    axisx: new pc.Color().fromString("#f44040"),
    axisz: new pc.Color().fromString("#3747f0"),
    odd: new pc.Color().fromString("#444444"),
    even: new pc.Color().fromString("#555555"),
    edge: new pc.Color().fromString("#333333"),
  };

  readonly #start = new pc.Vec3();
  readonly #end = new pc.Vec3();
  readonly #color = new pc.Color();

  constructor(root: pc.Entity) {
    super(root);
  }

  update(dt: number) {
    this.drawGrid();
  }

  private drawGrid() {
    const ext = this.size / 2;

    // Draw Grid
    for (let i = -ext; i <= ext; ++i) {
      this.setColor(i, ext);

      this.#start.x = this.#end.x = i;
      this.#start.z = ext;
      this.#end.z = i === 0 ? 0 : -ext;
      this.drawLine();

      this.#start.x = -ext;
      this.#end.x = i === 0 ? 0 : ext;
      this.#start.z = this.#end.z = i;
      this.drawLine();
    }

    // Draw Axis Markers
    this.#start.x = this.#start.z = 0;

    this.#end.x = ext;
    this.#end.z = 0;
    this.#color.copy(this.colors.axisx);
    this.drawLine();

    this.#end.x = 0;
    this.#end.z = -ext;
    this.#color.copy(this.colors.axisz);
    this.drawLine();
  }

  private setColor(i: number, ext: number) {
    if (i === 0) {
      this.#color.copy(this.colors.axis);
    } else if (i === -ext || i === ext) {
      this.#color.copy(this.colors.edge);
    } else if (i % 2 === 0) {
      this.#color.copy(this.colors.even);
    } else {
      this.#color.copy(this.colors.odd);
    }
  }

  private drawLine() {
    pc.app.drawLine(this.#start, this.#end, this.#color, true);
  }
}
