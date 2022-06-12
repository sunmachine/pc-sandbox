import * as pc from "playcanvas";
import { Gradient } from "../types/Color";

type SkyboxTextures = { envAtlas: pc.Texture; skybox: pc.Texture };

export class Skybox {
  private readonly x = 1024;
  private readonly y = 1024;

  // Sampled colors from this lovely screenshot:
  // https://github.com/danielshervheim/unity-stylized-sky
  private readonly gradient = new Gradient([
    { index: 0.0, color: 0x121223 },
    { index: 1.0, color: 0x897c7c },
  ]);

  generate(): SkyboxTextures {
    const t = new pc.Texture(pc.app.graphicsDevice, {
      format: pc.PIXELFORMAT_R8_G8_B8,
      width: this.x,
      height: this.y,
      addressU: pc.ADDRESS_CLAMP_TO_EDGE,
      addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    });

    const pixels = t.lock();
    let count = 0;

    for (let i = 0; i < this.x; i++) {
      const a = 1 - i / this.x;
      const c = this.gradient.sample(a);
      for (let j = 0; j < this.y; j++) {
        pixels[count++] = (c & 0xff0000) >> 16;
        pixels[count++] = (c & 0x00ff00) >> 8;
        pixels[count++] = c & 0x0000ff;
      }
    }

    t.unlock();

    return this.initFromTexture(t);
  }

  // Just stole this from the viewer, since this is absolutely silly.
  // https://github.com/playcanvas/model-viewer/blob/main/src/viewer.ts#L425
  #atlasOpts = {};
  private initFromTexture(env: pc.Texture): SkyboxTextures {
    const skybox = pc.EnvLighting.generateSkyboxCubemap(env);
    const lighting = pc.EnvLighting.generateLightingSource(env);

    // The second options parameter should not be necessary but the TS declarations require it for now
    const envAtlas = pc.EnvLighting.generateAtlas(lighting, this.#atlasOpts);
    lighting.destroy();

    return { envAtlas, skybox };
  }
}
