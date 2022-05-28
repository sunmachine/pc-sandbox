import type { SceneActor } from "../actors/SceneActor";

export interface Scene {
  init(): void;
}

export abstract class Scene {
  protected actors: Array<SceneActor> = [];
  constructor(protected app: pc.Application) {}
}
