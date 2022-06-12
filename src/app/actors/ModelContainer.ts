import * as pc from "playcanvas";
import { Actor } from "./Actor";
import type { File } from "../types/File";

export class ModelContainer extends Actor {
  constructor(root: pc.Entity) {
    super(root);
  }

  loadGltf(file: File, callback?: (entity: pc.Entity) => void): pc.Asset {
    const asset = new pc.Asset(file.filename, "container", file);
    asset.once("load", (asset) => this.onLoad(asset, callback));

    pc.app.assets.add(asset);
    pc.app.assets.load(asset);

    return asset;
  }

  private onLoad(asset: pc.Asset, callback?: (entity: pc.Entity) => void) {
    const entity: pc.Entity = asset.resource.instantiateRenderEntity();
    this.centerToTop(entity);
    this.root.addChild(entity);

    if (callback) callback(entity);
  }

  private centerToTop(entity: pc.Entity) {
    const aabb: pc.BoundingBox = entity.render?.meshInstances[0].aabb;
    const min = aabb.getMin();
    const pos = entity.getLocalPosition();
    pos.y -= min.y;
    entity.setPosition(pos);
  }
}
