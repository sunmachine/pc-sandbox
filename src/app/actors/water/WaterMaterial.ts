import {
  app,
  SEMANTIC_POSITION,
  SEMANTIC_TEXCOORD0,
  Material,
  Shader,
  CULLFACE_FRONT,
  CULLFACE_BACK,
  BLEND_NORMAL,
} from "playcanvas";
import volumeVert from "../../shaders/watervolume_vert.glsl";
import volumeFrag from "../../shaders/watervolume_frag.glsl";
import surfaceVert from "../../shaders/watersurface_vert.glsl";
import surfaceFrag from "../../shaders/watersurface_frag.glsl";

export type WaterMaterialType = "volume" | "surface";

export class WaterMaterial extends Material {
  private time: number;
  type: WaterMaterialType;

  constructor(type: WaterMaterialType) {
    super();

    this.type = type;
    this.shader = new Shader(app.graphicsDevice, {
      attributes: {
        a_position: SEMANTIC_POSITION,
        a_uv0: SEMANTIC_TEXCOORD0,
      },
      vshader: type === "volume" ? volumeVert : surfaceVert,
      fshader: type === "volume" ? volumeFrag : surfaceFrag,
    });

    this.cull = type === "volume" ? CULLFACE_FRONT : CULLFACE_BACK;
    this.blendType = BLEND_NORMAL;

    this.time = 0;
  }

  updateParameters(dt: number): void {
    this.time += dt;
    this.setParameter("time", this.time % 1.0);
  }
}
