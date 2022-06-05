import * as pc from "playcanvas";
import type { CameraActor } from "../actors/CameraActor";
import { SceneActor } from "../actors/SceneActor";
import { cartesianToSpherical, SphericalCoords } from "../math/SphericalCoords";
import type { Vector3 } from "../math/Vectors";
import { Direction, hasDirection } from "./Direction";

export class CameraInput extends SceneActor<CameraActor> {
  camera?: CameraActor;
  cameraPos: SphericalCoords = cartesianToSpherical(pc.Vec3.ZERO);
  focus: Vector3 = new pc.Vec3();

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

    this.camera?.entity?.lookAt(pc.Vec3.ZERO);

    return super.init(camera);
  }

  update(dt: number) {
    if (this.isMoving) {
      this.move(dt);
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
    const pos = this.camera?.entity?.getPosition();
    if (pos && this.currentMoveDir !== 0) {
      const amount = dt * this.moveSpeedScalar;
      pos.z -= amount * +hasDirection(this.currentMoveDir, Direction.FORWARD);
      pos.x += amount * +hasDirection(this.currentMoveDir, Direction.RIGHT);
      pos.z += amount * +hasDirection(this.currentMoveDir, Direction.BACK);
      pos.x -= amount * +hasDirection(this.currentMoveDir, Direction.LEFT);
      pos.y += amount * +hasDirection(this.currentMoveDir, Direction.UP);
      pos.y -= amount * +hasDirection(this.currentMoveDir, Direction.DOWN);

      this.camera?.entity?.setPosition(pos);
    }
  }

  // TODO: Store camera position as a spherical coordinate.
  //        Update camera position by offsetting the sphereical coordinate
  //        by the focus position Vector3.
  private orbit(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const pos = this.camera?.entity?.getPosition();
      if (pos) {
        const scoords = cartesianToSpherical(pos);
        scoords.polar += evt.dx * this.orbitSpeedScalar;
        scoords.elevation += evt.dy * this.orbitSpeedScalar;
        scoords.toCartesian(pos);
        this.camera?.entity?.setPosition(pos);
        this.camera?.entity?.lookAt(pc.Vec3.ZERO);
      }
    }
  }

  private pan(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const pos = this.camera?.entity?.getPosition();
      if (pos) {
        pos.x -= evt.dx * this.panSpeedScalar;
        pos.y += evt.dy * this.panSpeedScalar;
        this.camera?.entity?.setPosition(pos);
      }
    }
  }

  private zoom(evt: pc.MouseEvent) {
    if (evt.wheelDelta) {
      const pos = this.camera?.entity?.getPosition();
      if (pos) {
        const scoords = cartesianToSpherical(pos);
        scoords.radius += evt.wheelDelta * this.zoomSpeedScalar;
        scoords.toCartesian(pos);
        this.camera?.entity?.setPosition(pos);
        this.camera?.entity?.lookAt(pc.Vec3.ZERO);
      }
    }
  }
}
