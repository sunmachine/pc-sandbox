import * as pc from "playcanvas";
import { Actor } from "./Actor";
import { AnimatedVector } from "../types/AnimatedVector";
import { SphericalCoords } from "../types/SphericalCoords";
import type { Vector3 } from "../types/Vectors";
import { Viewer } from "../Viewer";
import { Direction, hasDirection } from "../types/Direction";
import { degToRad } from "../types/Radians";
import type { KeyMapping } from "../types/Keyboard";
import { clamp } from "../utils/Math";

export class Camera extends Actor {
  private readonly panSpeedScalar = 0.01;
  private readonly orbitSpeedScalar = 0.033;
  private readonly moveSpeedScalar = 10.0;
  private readonly zoomSpeedScalar = 0.5;

  private readonly zoomRange = [1, 10];

  private readonly _initialCoords = new SphericalCoords(
    5,
    degToRad(45.0),
    degToRad(22.0)
  );
  private readonly _initialFocus: Vector3 = new pc.Vec3();
  private readonly _input: CameraInput;

  cameraCoords = new AnimatedVector(this._initialCoords);
  focus = new AnimatedVector(new pc.Vec3());

  // Lazy pool vars.
  readonly #vecA = new pc.Vec3();
  readonly #vecB = new pc.Vec3();
  readonly #sphA = new SphericalCoords();

  constructor(root: pc.Entity) {
    super(root);

    // Register inputs.
    this._input = new CameraInput(this);
    this._input.keyMapping.push(
      ...[
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
      ]
    );

    // Setup entity.
    const camera = new pc.Entity("camera");
    root.addChild(camera);
    camera.addComponent("camera", {
      clearColor: new pc.Color(0.15, 0.15, 0.15),
    });
    this.entity = camera;
  }

  update(dt: number) {
    this._input.update();
    if (this._input.isMoving) {
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
    this.cameraCoords.stop();
    this.focus.stop();
    this._input.ignoreRemainingWheelInertia();

    if (target) this._initialFocus.copy(target.getPosition());
    this.focus.goto(this._initialFocus);

    // Only reset radius.
    this.#sphA.copy(this.cameraCoords.target).radius =
      this._initialCoords.radius;
    this.cameraCoords.goto(this.#sphA);
  }

  move(dt: number) {
    if (this._input.moveDirection !== 0) {
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
                (-hasDirection(this._input.moveDirection, n) +
                  +hasDirection(this._input.moveDirection, p)));
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

  orbit(evt: pc.MouseEvent) {
    if (evt.dx && evt.dy) {
      const update = this.#sphA.copy(this.cameraCoords.value);
      update.polar += evt.dx * this.orbitSpeedScalar;
      update.elevation += evt.dy * this.orbitSpeedScalar;
      this.cameraCoords.goto(update);
    }
  }

  pan(evt: pc.MouseEvent) {
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

  zoom(evt: pc.MouseEvent) {
    if (evt.wheelDelta) {
      const update = this.#sphA.copy(this.cameraCoords.value);
      update.radius = clamp(
        update.radius + evt.wheelDelta * this.zoomSpeedScalar,
        this.zoomRange[0],
        this.zoomRange[1]
      );
      this.cameraCoords.goto(update);
    }
  }
}

export class CameraInput {
  isMoving = false;
  moveDirection: Direction = Direction.NONE;
  readonly keyMapping: Array<KeyMapping> = [];

  private _pressedKeys = new Set<number>();
  private _camera: Camera;

  private _wheelInertia = false;
  private _ignoreRemainingInertia = false;
  #inertiaLastFrame = 0;
  #inertiaCount = 0;

  constructor(camera: Camera) {
    this._camera = camera;

    // Register controls.
    pc.app.keyboard.on(pc.EVENT_KEYDOWN, (e: pc.KeyboardEvent) =>
      this.onKeyDown(e)
    );
    pc.app.keyboard.on(pc.EVENT_KEYUP, (e: pc.KeyboardEvent) =>
      this.onKeyUp(e)
    );
    pc.app.mouse.on(pc.EVENT_MOUSEMOVE, (e: pc.MouseEvent) =>
      this.onMouseMove(e)
    );
    pc.app.mouse.on(pc.EVENT_MOUSEWHEEL, (e: pc.MouseEvent) =>
      this.onMouseWheel(e)
    );
  }

  update() {
    this.checkInertiaStop();
  }

  ignoreRemainingWheelInertia() {
    this._ignoreRemainingInertia = true;
  }

  private onKeyDown(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        pc.app.keyboard.isPressed(map.key) &&
        !this._pressedKeys.has(map.key)
      ) {
        if (map.direction && !hasDirection(this.moveDirection, map.direction)) {
          this.moveDirection += map.direction;
        }
        this._pressedKeys.add(map.key);
      }
    });

    if (this.moveDirection > Direction.NONE && !this.isMoving) {
      this.isMoving = true;
      evt.event.preventDefault();
    }
  }

  private onKeyUp(evt: pc.KeyboardEvent) {
    this.keyMapping.forEach((map) => {
      if (
        !pc.app.keyboard.isPressed(map.key) &&
        this._pressedKeys.has(map.key)
      ) {
        if (map.direction && hasDirection(this.moveDirection, map.direction)) {
          this.moveDirection -= map.direction;
        }
        if (map.callback) map.callback();
        this._pressedKeys.delete(map.key);
      }
    });

    if (this.moveDirection === Direction.NONE && this.isMoving) {
      this.isMoving = false;
      evt.event.preventDefault();
    }
  }

  private onMouseMove(evt: pc.MouseEvent) {
    if (pc.app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
      if (pc.app.keyboard.isPressed(pc.KEY_SHIFT)) {
        this._camera.pan(evt);
      } else {
        this._camera.orbit(evt);
      }

      evt.event.preventDefault();
    }
  }

  private onMouseWheel(evt: pc.MouseEvent) {
    if (!this._ignoreRemainingInertia) this._camera.zoom(evt);

    if (evt.wheelDelta) {
      this.updateInertia();
      evt.event.preventDefault();
    }
  }

  private updateInertia() {
    this._wheelInertia = true;
    this.#inertiaCount++;
  }

  private checkInertiaStop() {
    if (
      this._wheelInertia &&
      this.#inertiaCount !== 0 &&
      this.#inertiaCount === this.#inertiaLastFrame
    ) {
      this.#inertiaCount = 0;
      this.#inertiaLastFrame = 0;
      this._wheelInertia = false;
      this._ignoreRemainingInertia = false;
    } else {
      this.#inertiaLastFrame = this.#inertiaCount;
    }
  }
}
