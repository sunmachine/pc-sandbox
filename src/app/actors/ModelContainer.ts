import * as pc from "playcanvas";
import { Actor } from "./Actor";
import type { File } from "../types/File";

export class ModelContainer extends Actor {
  constructor(root: pc.Entity) {
    super(root);
  }

  async loadGltf(file: File): Promise<pc.Entity> {
    return new Promise<pc.Entity>((resolve, reject) => {
      const asset = new pc.Asset(file.filename, "container", file);
      asset.once("load", (asset) => {
        this.onLoad(asset, (result: pc.Entity | unknown) => {
          if (result instanceof pc.Entity) resolve(result);
          else reject(result);
        });
      });

      pc.app.assets.add(asset);
      pc.app.assets.load(asset);
    });
  }

  private onLoad(asset: pc.Asset, callback: (entity: pc.Entity) => void) {
    const entity: pc.Entity = asset.resource.instantiateRenderEntity();
    if (entity) {
      this.centerToTop(entity);
      this.root.addChild(entity);
    }

    callback(entity);
  }

  private centerToTop(entity: pc.Entity) {
    const aabb: pc.BoundingBox = entity.render?.meshInstances[0].aabb;
    const min = aabb.getMin();
    const pos = entity.getLocalPosition();
    pos.y -= min.y;

    entity.setPosition(pos);
  }
}
