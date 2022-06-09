import * as pc from "playcanvas";
import { Actor } from "./Actor";
import { AnimatedVector } from "../types/AnimatedVector";
import { SphericalCoords } from "../types/SphericalCoords";
import type { Vector3 } from "../types/Vectors";
import { Viewer } from "../Viewer";
import { Direction, hasDirection } from "../types/Direction";
import { degToRad } from "../types/Radians";

export class Camera extends Actor {
  cameraCoords = new AnimatedVector(
    new SphericalCoords(5, degToRad(45.0), degToRad(22.0))
  );
  focus = new AnimatedVector(new pc.Vec3());

  private _moveDir: Direction = Direction.NONE;
  private _pressedKeys = new Set<number>();
  private _isMoving = false;

  private readonly panSpeedScalar = 0.01;
  private readonly orbitSpeedScalar = 0.033;
  private readonly moveSpeedScalar = 10.0;
  private readonly zoomSpeedScalar = 0.5;

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

  constructor(root: pc.Entity) {
    super(root);

    // Setup entity.
    const camera = new pc.Entity("camera");
    root.addChild(camera);
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.15, 0.15, 0.15),
    });
    this.entity = camera;

    // Register controls.
    Viewer.app.mouse.on("mousemove", (e) => this.onMouseMove(e));
    Viewer.app.mouse.on("mousewheel", (e) => this.onMouseWheel(e));
    Viewer.app.keyboard.on("keydown", (e) => this.onKeyDown(e));
    Viewer.app.keyboard.on("keyup", (e) => this.onKeyUp(e));
  }

  #update = new pc.Vec3();
  update(dt: number) {
    if (this._isMoving) {
      this.move(dt);
    }

    if (this.cameraCoords.update(dt) || this.focus.update(dt)) {
      this.cameraCoords.value.toCartesian(this.#update).add(this.focus.value);
      this.entity.setPosition(this.#update);
      this.entity.lookAt(this.focus.value);
    }
  }

  focusOnEntity(target: pc.Entity) {
    this.focus.goto(target.getPosition());
  }

  private onMouseWheel(evt: pc.MouseEvent) {
    this.zoom(evt);

    if (evt.wheelDelta) {
      evt.event.preventDefault();
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

  #moveA = new pc.Vec3();
  #moveB = new pc.Vec3();
  private move(dt: number) {
    if (this._moveDir !== 0) {
      const transform = this.entity;

      if (transform) {
        const scaleBy = (
          vec: Vector3,
          scale: number,
          n: Direction,
          p: Direction
        ) => {
          // Handle operations in this order to avoid GC.
          // prettier-ignore
          return this.#moveA
            .copy(vec)
            .mulScalar(
              scale *
                (-1 * +hasDirection(this._moveDir, n) +
                  1 * +hasDirection(this._moveDir, p)));
        };
        const moveSpeed = dt * this.moveSpeedScalar;

        // prettier-ignore
        this.#moveB
          .copy(this.focus.value)
          .add(scaleBy(
              transform.forward,
              moveSpeed,
              Direction.BACK,
              Direction.FORWARD
          ))
          .add(scaleBy(
            transform.right,
            moveSpeed,
            Direction.LEFT,
            Direction.RIGHT
          ))
          .add(scaleBy(
            transform.up,
            moveSpeed,
            Direction.DOWN,
            Direction.UP
          ));
        this.focus.goto(this.#moveB);
      }
    }
  }

  #orbit = new SphericalCoords();
  private orbit(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const update = this.#orbit.copy(this.cameraCoords.value);
      update.polar += evt.dx * this.orbitSpeedScalar;
      update.elevation += evt.dy * this.orbitSpeedScalar;
      this.cameraCoords.goto(update);
    }
  }

  #panA = new pc.Vec3();
  #panB = new pc.Vec3();
  private pan(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const transform = this.entity;
      if (transform) {
        const scaleBy = (vec: Vector3, scale: number) => {
          // Handle operations in this order to avoid GC.
          return this.#panA.copy(vec).mulScalar(scale);
        };

        this.#panB
          .copy(this.focus.value)
          .add(scaleBy(transform.up, this.panSpeedScalar * evt.dy))
          .add(scaleBy(transform.right, this.panSpeedScalar * -evt.dx));

        this.focus.goto(this.#panB);
      }
    }
  }

  #zoom = new SphericalCoords();
  private zoom(evt: pc.MouseEvent) {
    if (evt.wheelDelta) {
      const update = this.#zoom.copy(this.cameraCoords.value);
      update.radius += evt.wheelDelta * this.zoomSpeedScalar;
      this.cameraCoords.goto(update);
    }
  }
}
