import { Entity, MeshInstance } from "playcanvas";
import * as pc from "playcanvas";
import { Actor } from "../Actor";
import { WaterMaterial } from "./WaterMaterial";

export class Water extends Actor {
  private material: WaterMaterial;

  constructor(root: pc.Entity) {
    super(root);

    const mesh = pc.createBox(pc.app.graphicsDevice);
    this.material = new WaterMaterial();
    const meshInstance = new MeshInstance(mesh, this.material);
    const entity = new Entity();

    entity.addComponent("render", {
      meshInstances: [meshInstance],
    });
    this.root.addChild(entity);
    entity.setPosition(0, 0.5, 0);

    this.entity = entity;
  }

  update(dt: number) {
    this.material.updateParameters(dt);
  }
}
