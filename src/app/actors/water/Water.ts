import { Entity, MeshInstance } from "playcanvas";
import * as pc from "playcanvas";
import { Actor } from "../Actor";
import { WaterMaterial } from "./WaterMaterial";
import { addLayer } from "@/app/utils/Layers";

export const LAYER_WATERVOLUME = 128;
export const LAYER_WATERSURFACE = 129;

export class Water extends Actor {
  private volumeMat: WaterMaterial;
  private surfaceMat: WaterMaterial;

  constructor(root: pc.Entity) {
    super(root);

    const mesh = pc.createBox(pc.app.graphicsDevice);

    this.volumeMat = new WaterMaterial("volume");
    this.surfaceMat = new WaterMaterial("surface");

    this.volumeMat.cull = pc.CULLFACE_FRONT;
    this.surfaceMat.cull = pc.CULLFACE_BACK;
    this.volumeMat.blendType = this.surfaceMat.blendType = pc.BLEND_NORMAL;

    const volumeMesh = new MeshInstance(mesh, this.volumeMat);
    const surfaceMesh = new MeshInstance(mesh, this.surfaceMat);

    const parent = new Entity();
    const volumeEntity = new Entity();
    const surfaceEntity = new Entity();
    parent.addChild(volumeEntity);
    parent.addChild(surfaceEntity);

    volumeEntity.addComponent("render", {
      meshInstances: [volumeMesh],
    });
    surfaceEntity.addComponent("render", {
      meshInstances: [surfaceMesh],
    });

    volumeEntity.render?.layers;

    this.root.addChild(parent);
    parent.setPosition(0, 0.5, 0);

    this.entity = parent;
  }

  update(dt: number) {
    this.volumeMat.updateParameters(dt);
    this.surfaceMat.updateParameters(dt);
  }

  static setupPrerequisites(scene?: pc.Scene, camera?: pc.CameraComponent) {
    const layers = scene?.layers;

    // Assumes World's transparent layer is on index 3.
    if (layers) {
      if (!layers.getLayerById(LAYER_WATERVOLUME)) {
        const waterVolume = new pc.Layer({
          name: "WaterVolume",
          id: LAYER_WATERVOLUME,
          opaqueSortMode: pc.SORTMODE_NONE,
          transparentSortMode: pc.SORTMODE_BACK2FRONT,
        });

        layers.insertTransparent(waterVolume, 3);
      }

      if (!layers.getLayerById(LAYER_WATERSURFACE)) {
        const waterSurface = new pc.Layer({
          name: "WaterSurface",
          id: LAYER_WATERSURFACE,
          opaqueSortMode: pc.SORTMODE_NONE,
          transparentSortMode: pc.SORTMODE_BACK2FRONT,
        });

        layers.insertTransparent(waterSurface, 4);
      }
    }

    if (camera) {
      addLayer(camera, LAYER_WATERVOLUME);
      addLayer(camera, LAYER_WATERSURFACE);
    }
  }
}
