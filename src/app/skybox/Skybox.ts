import * as pc from "playcanvas";

export class Skybox {
  private readonly _x = 128;
  private readonly _y = 128;

  generate(): { envAtlas: pc.Texture; skybox: pc.Texture } {
    const t = new pc.Texture(app.graphicsDevice, {
      format: pc.PIXELFORMAT_R8_G8_B8,
      width: this._x,
      height: this._y,
      addressU: pc.ADDRESS_CLAMP_TO_EDGE,
      addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    });

    const pixels = t.lock();
    let count = 0;
    for (let i = 0; i < this._x; i++) {
      for (let j = 0; j < this._y; j++) {
        const c = 256 - i * (256 / this._y);
        pixels[count++] = c;
        pixels[count++] = c;
        pixels[count++] = c;
      }
    }
    t.unlock();

    return this.initFromTexture(t);
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
