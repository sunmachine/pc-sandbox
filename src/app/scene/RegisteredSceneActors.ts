import type { Actor } from "../actors/Actor";
import type { Camera } from "../actors/Camera";
import type { Compass } from "../actors/Compass";
import type { Grid } from "../actors/Grid";
import type { Light } from "../actors/Light";

export interface RegisteredSceneActors {
  camera?: Camera;
  compass?: Compass;
  grid?: Grid;
  light?: Light;
  activeActor?: Actor;
}
