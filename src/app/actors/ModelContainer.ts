import * as pc from "playcanvas";
import { Actor } from "./Actor";

export class ModelContainer extends Actor {
  constructor(root: pc.Entity) {
    super(root);
  }

  async loadGltf(input: File | string): Promise<pc.Entity> {
    const isFile = input instanceof File;
    const entry = isFile
      ? {
          url: URL.createObjectURL(input),
          filename: input.name,
        }
      : {
          url: input,
          filename: input,
        };

    return new Promise<pc.Entity>((resolve, reject) => {
      const asset = new pc.Asset(entry.filename, "container", entry);
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

    this.entity = entity;
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
