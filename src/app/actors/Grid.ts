import * as pc from "playcanvas";
import { Viewer } from "../Viewer";
import { Actor } from "./Actor";

export class Grid extends Actor {
  private readonly _start = new pc.Vec3();
  private readonly _end = new pc.Vec3();
  private readonly _color = new pc.Color();

  private readonly size = 10;
  private readonly colors = {
    axis: "#dddddd",
    odd: "#888888",
    even: "#555555",
    edge: "#333333",
  };

  constructor(root: pc.Entity) {
    super(root);
  }

  update(dt: number) {
    this.drawGrid();
  }

  private drawGrid() {
    const ext = this.size / 2;

    for (let i = -ext; i <= ext; ++i) {
      this.setColor(i, ext);

      this._start.x = this._end.x = i;
      this._start.z = -ext;
      this._end.z = ext;
      this.drawLine();

      this._start.x = -ext;
      this._end.x = ext;
      this._start.z = this._end.z = i;
      this.drawLine();
    }
  }

  private setColor(i: number, ext: number) {
    if (i === 0) this._color.fromString(this.colors.axis);
    else if (i === -ext || i === ext) this._color.fromString(this.colors.edge);
    else if (i % 2 === 0) this._color.fromString(this.colors.even);
    else this._color.fromString(this.colors.odd);
  }

  private drawLine() {
    Viewer.app.drawLine(this._start, this._end, this._color, true);
  }
}
