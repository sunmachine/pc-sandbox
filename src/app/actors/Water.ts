import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class Water extends Actor {
  constructor(root: pc.Entity) {
    super(root);

    const mesh = pc.createBox(pc.app.graphicsDevice);
    const meshInstance = new pc.MeshInstance(mesh, new pc.BasicMaterial());
    const entity = new pc.Entity();

    entity.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.root.addChild(entity);
    entity.setPosition(0, 0.5, 0);

    this.entity = entity;
  }
}
