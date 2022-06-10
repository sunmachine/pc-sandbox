import { lerpHexColor } from "../utils/Color";

export type HexColor = number;

export interface GradientKey {
  index: number;
  color: HexColor;
}

export interface Gradient {
  readonly entries: Array<GradientKey>;
  sample(t: number): HexColor;
}

export class Gradient {
  readonly entries: Array<GradientKey> = [];
  constructor(entries?: Array<GradientKey>) {
    if (entries) {
      const min = Math.min(...entries.map((k) => k.index));
      const max = Math.max(...entries.map((k) => k.index));
      this.entries.push(
        ...entries
          .sort((a, b) => a.index - b.index)
          .map((key) => ({
            index: key.index - min / max - min,
            color: key.color,
          }))
      );
    }
  }

  sample(t: number): HexColor {
    const e = this.entries;

    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      if (i + 1 === e.length) return a.color;

      const b = e[i + 1];
      if (t >= a.index && t < b.index) return lerpHexColor(a.color, b.color, t);
    }

    return e[e.length - 1].color;
  }
}
