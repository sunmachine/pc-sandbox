import * as pc from "playcanvas";
import type { Camera } from "../actors/Camera";
import { Actor } from "../actors/Actor";
import { cartesianToSpherical, SphericalCoords } from "../math/SphericalCoords";
import type { Vector3 } from "../math/Vectors";
import { Viewer } from "../Viewer";
import { Direction, hasDirection } from "./Direction";

export class CameraInput extends Actor<Camera> {
  camera?: Camera;
  cameraCoords: SphericalCoords = cartesianToSpherical(pc.Vec3.ZERO);
  focus: Vector3 = new pc.Vec3();

  private _camPosUpdate: Vector3 = new pc.Vec3();
  private _moveDir: Direction = Direction.NONE;
  private _pressedKeys = new Set<number>();
  private _isMoving = false;

  private readonly panSpeedScalar = 0.01;
  private readonly orbitSpeedScalar = 0.01;
  private readonly moveSpeedScalar = 1;
  private readonly zoomSpeedScalar = 0.1;

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

  init(camera?: Camera): this {
    this.camera = camera;

    Viewer.app.mouse.on("mousemove", (e) => this.onMouseMove(e));
    Viewer.app.mouse.on("mousewheel", (e) => this.onMouseWheel(e));
    Viewer.app.keyboard.on("keydown", (e) => this.onKeyDown(e));
    Viewer.app.keyboard.on("keyup", (e) => this.onKeyUp(e));

    cartesianToSpherical(new pc.Vec3(0, 1, 3), this.cameraCoords);
    this.updateCameraFocus();

    return super.init(camera);
  }

  update(dt: number) {
    if (this._isMoving) {
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
    if (Viewer.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
      if (Viewer.app.keyboard.isPressed(pc.KEY_SHIFT)) {
        this.pan(evt);
      } else {
        this.orbit(evt);
      }
    }
  }

  private onKeyDown(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        Viewer.app.keyboard.isPressed(map.key) &&
        !this._pressedKeys.has(map.key) &&
        hasDirection(this._moveDir, map.direction) === false
      ) {
        this._pressedKeys.add(map.key);
        this._moveDir += map.direction;
      }
    });

    if (this._moveDir > Direction.NONE && !this._isMoving) {
      this._isMoving = true;
      evt.event.preventDefault();
    }
  }

  private onKeyUp(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        !Viewer.app.keyboard.isPressed(map.key) &&
        this._pressedKeys.has(map.key) &&
        hasDirection(this._moveDir, map.direction)
      ) {
        this._pressedKeys.delete(map.key);
        this._moveDir -= map.direction;
      }
    });

    if (this._moveDir === Direction.NONE && this._isMoving) {
      this._isMoving = false;
      evt.event.preventDefault();
    }
  }

  private move(dt: number) {
    if (this._moveDir !== 0) {
      const transform = this.camera?.entity;

      if (transform) {
        const scaleBy = (vec: Vector3, n: Direction, p: Direction) => {
          return this._camPosUpdate
            .copy(vec)
            .mulScalar(
              dt *
                this.moveSpeedScalar *
                (-1 * +hasDirection(this._moveDir, n) +
                  1 * +hasDirection(this._moveDir, p))
            );
        };

        this.focus
          .add(scaleBy(transform.forward, Direction.BACK, Direction.FORWARD))
          .add(scaleBy(transform.right, Direction.LEFT, Direction.RIGHT))
          .add(scaleBy(transform.up, Direction.DOWN, Direction.UP));

        this.updateCameraFocus();
      }
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
