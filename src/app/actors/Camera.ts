import * as pc from "playcanvas";
import { Actor } from "./Actor";
import { AnimatedVector } from "../types/AnimatedVector";
import { SphericalCoords } from "../types/SphericalCoords";
import type { Vector3 } from "../types/Vectors";
import { Viewer } from "../Viewer";
import { Direction, hasDirection } from "../types/Direction";
import { degToRad } from "../types/Radians";
import type { KeyMapping } from "../types/Keyboard";

export class Camera extends Actor {
  cameraCoords = new AnimatedVector(
    new SphericalCoords(5, degToRad(45.0), degToRad(22.0))
  );
  focus = new AnimatedVector(new pc.Vec3());

  private _initialFocus: Vector3 = new pc.Vec3();
  private _moveDir: Direction = Direction.NONE;
  private _pressedKeys = new Set<number>();
  private _isMoving = false;

  private readonly panSpeedScalar = 0.01;
  private readonly orbitSpeedScalar = 0.033;
  private readonly moveSpeedScalar = 10.0;
  private readonly zoomSpeedScalar = 0.5;

  // Lazy pool vars.
  readonly #vecA = new pc.Vec3();
  readonly #vecB = new pc.Vec3();
  readonly #sphA = new SphericalCoords();

  private readonly keyMapping: Array<KeyMapping> = [
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
    { key: pc.KEY_F, callback: () => this.focusOnEntity() },
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

  update(dt: number) {
    if (this._isMoving) {
      this.move(dt);
    }

    const updateCoord = this.cameraCoords.update(dt);
    const updateFocus = this.focus.update(dt);

    if (updateCoord || updateFocus) {
      this.cameraCoords.value.toCartesian(this.#vecA).add(this.focus.value);
      this.entity.setPosition(this.#vecA);
      this.entity.lookAt(this.focus.value);
    }
  }

  focusOnEntity(target?: pc.Entity) {
    if (target) this._initialFocus.copy(target.getPosition());
    this.focus.goto(this._initialFocus);
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
        !this._pressedKeys.has(map.key)
      ) {
        if (map.direction && !hasDirection(this._moveDir, map.direction)) {
          this._moveDir += map.direction;
        }
        this._pressedKeys.add(map.key);
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
        this._pressedKeys.has(map.key)
      ) {
        if (map.direction && hasDirection(this._moveDir, map.direction)) {
          this._moveDir -= map.direction;
        }
        if (map.callback) map.callback();
        this._pressedKeys.delete(map.key);
      }
    });

    if (this._moveDir === Direction.NONE && this._isMoving) {
      this._isMoving = false;
      evt.event.preventDefault();
    }
  }

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
          return this.#vecA
            .copy(vec)
            .mulScalar(
              scale *
                (-1 * +hasDirection(this._moveDir, n) +
                  1 * +hasDirection(this._moveDir, p)));
        };
        const moveSpeed = dt * this.moveSpeedScalar;

        // prettier-ignore
        this.#vecB
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
        this.focus.goto(this.#vecB);
      }
    }
  }

  private orbit(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const update = this.#sphA.copy(this.cameraCoords.value);
      update.polar += evt.dx * this.orbitSpeedScalar;
      update.elevation += evt.dy * this.orbitSpeedScalar;
      this.cameraCoords.goto(update);
    }
  }

  private pan(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const transform = this.entity;
      if (transform) {
        const scaleBy = (vec: Vector3, scale: number) => {
          // Handle operations in this order to avoid GC.
          return this.#vecA.copy(vec).mulScalar(scale);
        };

        this.#vecB
          .copy(this.focus.value)
          .add(scaleBy(transform.up, this.panSpeedScalar * evt.dy))
          .add(scaleBy(transform.right, this.panSpeedScalar * -evt.dx));

        this.focus.goto(this.#vecB);
      }
    }
  }

  private zoom(evt: pc.MouseEvent) {
    if (evt.wheelDelta) {
      const update = this.#sphA.copy(this.cameraCoords.value);
      update.radius += evt.wheelDelta * this.zoomSpeedScalar;
      this.cameraCoords.goto(update);
    }
  }
}
