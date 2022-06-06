export type HexColor = number;
export type GradientKey = { index: number; color: HexColor };

export interface Gradient {
  readonly sentries: Array<GradientKey>;

  sample(t: number): HexColor;
}

export class Gradient {
  readonly entries: Array<GradientKey>;
  constructor(entries?: Array<GradientKey>) {
    if (entries) {
      const min = Math.min(...entries.map((k) => k.index));
      const max = Math.max(...entries.map((k) => k.index));
      this.entries = entries
        .sort((a, b) => a.index - b.index)
        .map((key) => ({
          index: key.index - min / max - min,
          color: key.color,
        }));
    } else this.entries = new Array<GradientKey>();
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

export function lerpHexColor(a: HexColor, b: HexColor, t: number): HexColor {
  const // A
    ar = (a & 0xff0000) >> 16,
    ag = (a & 0x00ff00) >> 8,
    ab = a & 0x0000ff,
    // B
    br = (b & 0xff0000) >> 16,
    bg = (b & 0x00ff00) >> 8,
    bb = b & 0x0000ff,
    // Result
    rr = ar + t * (br - ar),
    rg = ag + t * (bg - ag),
    rb = ab + t * (bb - ab);

  return (rr << 16) + (rg << 8) + (rb | 0);
}
