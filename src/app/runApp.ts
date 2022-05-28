import * as pc from "playcanvas";
import { MainScene } from "./scene/MainScene";

export function runApp(canvas: Element) {
  const app = new pc.Application(canvas, {
    elementInput: new pc.ElementInput(canvas),
    mouse: new pc.Mouse(canvas),
    touch: "ontouchstart" in window ? new pc.TouchDevice(canvas) : undefined,
    keyboard: new pc.Keyboard(window),
  });

  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  window.addEventListener("resize", () => app.resizeCanvas());

  const scene = new MainScene(app);
  scene.init();

  app.start();
}
