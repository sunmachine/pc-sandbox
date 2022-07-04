import {
  app,
  SEMANTIC_POSITION,
  SEMANTIC_TEXCOORD0,
  Material,
  Shader,
} from "playcanvas";
import vertexShader from "../../shaders/basicvertex.glsl";
import fragmentShader from "../../shaders/basicfragment.glsl";

export class WaterMaterial extends Material {
  private time: number;

  constructor() {
    super();

    this.shader = new Shader(app.graphicsDevice, {
      attributes: {
        a_position: SEMANTIC_POSITION,
        a_uv0: SEMANTIC_TEXCOORD0,
      },
      vshader: vertexShader,
      fshader: fragmentShader,
    });

    this.time = 0;
  }

  updateParameters(dt: number): void {
    this.time += dt;

    this.setParameter("time", this.time % 1.0);
  }
}
