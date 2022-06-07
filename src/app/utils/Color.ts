import type { HexColor } from "../types/Color";

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
