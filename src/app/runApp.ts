import * as pc from "playcanvas";
import { MainScene } from "./scene/MainScene";

export function runApp(canvas: Element) {
  const app = new pc.Application(canvas);

  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  window.addEventListener("resize", () => app.resizeCanvas());

  const scene = new MainScene(app);
  scene.init();

  app.start();
}
