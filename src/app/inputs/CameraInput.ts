import * as pc from "playcanvas";
import type { CameraActor } from "../actors/CameraActor";
import { SceneActor } from "../actors/SceneActor";
import { cartesianToSpherical, SphericalCoords } from "../math/SphericalCoords";
import type { Vector3 } from "../math/Vectors";
import { Direction, hasDirection } from "./Direction";

export class CameraInput extends SceneActor<CameraActor> {
  camera?: CameraActor;
  cameraCoords: SphericalCoords = cartesianToSpherical(pc.Vec3.ZERO);
  focus: Vector3 = new pc.Vec3();

  private _camPosUpdate: Vector3 = new pc.Vec3();

  private readonly panSpeedScalar = 0.01;
  private readonly orbitSpeedScalar = 0.01;
  private readonly moveSpeedScalar = 1;
  private readonly zoomSpeedScalar = 0.1;

  private currentMoveDir: Direction = Direction.NONE;
  private pressedKeys = new Set<number>();

  private isMoving = false;

  private readonly keyMapping = [
    { key: pc.KEY_UP, direction: Direction.FORWARD },
    { key: pc.KEY_W, direction: Direction.FORWARD },
    { key: pc.KEY_RIGHT, direction: Direction.RIGHT },
    { key: pc.KEY_D, direction: Direction.RIGHT },
    { key: pc.KEY_DOWN, direction: Direction.BACK },
    { key: pc.KEY_S, direction: Direction.BACK },
    { key: pc.KEY_LEFT, direction: Direction.LEFT },
    { key: pc.KEY_A, direction: Direction.LEFT },
    { key: pc.KEY_E, direction: Direction.UP },
    { key: pc.KEY_Q, direction: Direction.DOWN },
  ];

  init(camera?: CameraActor): this {
    this.camera = camera;

    app.mouse.on("mousemove", (e) => this.onMouseMove(e));
    app.mouse.on("mousewheel", (e) => this.onMouseWheel(e));
    app.keyboard.on("keydown", (e) => this.onKeyDown(e));
    app.keyboard.on("keyup", (e) => this.onKeyUp(e));

    cartesianToSpherical(new pc.Vec3(0, 1, 3), this.cameraCoords);
    this.updateCameraFocus();

    return super.init(camera);
  }

  update(dt: number) {
    if (this.isMoving) {
      this.move(dt);
    }
  }

  private updateCameraFocus() {
    if (this.camera?.entity) {
      this.cameraCoords.toCartesian(this._camPosUpdate).add(this.focus);
      this.camera.entity.setPosition(this._camPosUpdate);
      this.camera.entity.lookAt(this.focus);
    }
  }

  private onMouseWheel(evt: pc.MouseEvent) {
    if (evt) {
      this.zoom(evt);

      if (evt.wheelDelta) {
        evt.event.preventDefault();
      }
    }
  }

  private onMouseMove(evt: pc.MouseEvent) {
    if (app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
      if (app.keyboard.isPressed(pc.KEY_SHIFT)) {
        this.pan(evt);
      } else {
        this.orbit(evt);
      }
    }
  }

  private onKeyDown(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        app.keyboard.isPressed(map.key) &&
        !this.pressedKeys.has(map.key) &&
        hasDirection(this.currentMoveDir, map.direction) === false
      ) {
        this.pressedKeys.add(map.key);
        this.currentMoveDir += map.direction;
      }
    });

    if (this.currentMoveDir > Direction.NONE && !this.isMoving) {
      this.isMoving = true;
      evt.event.preventDefault();
    }
  }

  private onKeyUp(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        !app.keyboard.isPressed(map.key) &&
        this.pressedKeys.has(map.key) &&
        hasDirection(this.currentMoveDir, map.direction)
      ) {
        this.pressedKeys.delete(map.key);
        this.currentMoveDir -= map.direction;
      }
    });

    if (this.currentMoveDir === Direction.NONE && this.isMoving) {
      this.isMoving = false;
      evt.event.preventDefault();
    }
  }

  private move(dt: number) {
    if (this.currentMoveDir !== 0) {
      const d = dt * this.moveSpeedScalar;
      this.focus.z -= d * +hasDirection(this.currentMoveDir, Direction.FORWARD);
      this.focus.x += d * +hasDirection(this.currentMoveDir, Direction.RIGHT);
      this.focus.z += d * +hasDirection(this.currentMoveDir, Direction.BACK);
      this.focus.x -= d * +hasDirection(this.currentMoveDir, Direction.LEFT);
      this.focus.y += d * +hasDirection(this.currentMoveDir, Direction.UP);
      this.focus.y -= d * +hasDirection(this.currentMoveDir, Direction.DOWN);

      this.updateCameraFocus();
    }
  }

  private orbit(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      this.cameraCoords.polar += evt.dx * this.orbitSpeedScalar;
      this.cameraCoords.elevation += evt.dy * this.orbitSpeedScalar;
      this.updateCameraFocus();
    }
  }

  private pan(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      this.focus.x -= evt.dx * this.panSpeedScalar;
      this.focus.y += evt.dy * this.panSpeedScalar;
      this.updateCameraFocus();
    }
  }

  private zoom(evt: pc.MouseEvent) {
    if (evt.wheelDelta) {
      this.cameraCoords.radius += evt.wheelDelta * this.zoomSpeedScalar;
      this.updateCameraFocus();
    }
  }
}
