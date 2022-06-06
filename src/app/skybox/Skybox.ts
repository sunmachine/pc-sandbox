import * as pc from "playcanvas";

type GradientKey = { index: number; color: pc.Color };

export class Skybox {
  private readonly x = 128;
  private readonly y = 128;

  // Sampled colors from this lovely screenshot:
  // https://github.com/danielshervheim/unity-stylized-sky
  private readonly gradient: Array<GradientKey> = [
    { index: 0.0, color: new pc.Color().fromString("#a5cbcd") },
    { index: 0.5, color: new pc.Color().fromString("#cddfda") },
    { index: 1.0, color: new pc.Color().fromString("#1d2f3b") },
  ].sort((a, b) => a.index - b.index);

  private _color = new pc.Color();

  generate(): { envAtlas: pc.Texture; skybox: pc.Texture } {
    const t = new pc.Texture(app.graphicsDevice, {
      format: pc.PIXELFORMAT_R8_G8_B8,
      width: this.x,
      height: this.y,
      addressU: pc.ADDRESS_CLAMP_TO_EDGE,
      addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    });

    const pixels = t.lock();
    let count = 0;
    for (let i = 0; i < this.x; i++) {
      const a = pc.math.clamp(1 - i / this.x, 0.0, 1.0);
      const c = this.getColor(a);
      for (let j = 0; j < this.y; j++) {
        pixels[count++] = c.r * 256;
        pixels[count++] = c.g * 256;
        pixels[count++] = c.b * 256;
      }
    }
    t.unlock();

    return this.initFromTexture(t);
  }

  private getColor(t: number): pc.Color {
    for (let i = 0; i < this.gradient.length; i++) {
      const kA = this.gradient[i];
      if (i + 1 === this.gradient.length) return kA.color;

      const kB = this.gradient[i + 1];
      if (t >= kA.index && t < kB.index) {
        return this._color.lerp(kA.color, kB.color, t);
      }
    }

    return this.gradient[this.gradient.length - 1].color;
  }

  // Just stole this from the viewer, since this is absolutely silly.
  // https://github.com/playcanvas/model-viewer/blob/main/src/viewer.ts#L425
  private initFromTexture(env: pc.Texture) {
    const skybox = pc.EnvLighting.generateSkyboxCubemap(env);
    const lighting = pc.EnvLighting.generateLightingSource(env);

    // The second options parameter should not be necessary but the TS declarations require it for now
    const envAtlas = pc.EnvLighting.generateAtlas(lighting, {});
    lighting.destroy();

    return { envAtlas, skybox };
  }
}
