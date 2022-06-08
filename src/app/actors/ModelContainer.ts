import * as pc from "playcanvas";
import { Actor } from "./Actor";
import { Viewer } from "../Viewer";
import type { File } from "../types/File";

export class ModelContainer extends Actor {
  constructor(root: pc.Entity) {
    super(root);
  }

  loadGltf(file: File): pc.Asset {
    const asset = new pc.Asset(file.filename, "container", file);
    asset.once("load", (asset) => this.onLoad(asset));

    Viewer.app.assets.add(asset);
    Viewer.app.assets.load(asset);

    return asset;
  }

  private onLoad(asset: pc.Asset) {
    const renderRootEntity = asset.resource.instantiateRenderEntity();
    this.root.addChild(renderRootEntity);
  }
}
