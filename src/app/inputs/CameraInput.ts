import * as pc from "playcanvas";
import type { CameraActor } from "../actors/CameraActor";
import { SceneActor } from "../actors/SceneActor";
import { Direction, hasDirection } from "./Direction";

export class CameraInput extends SceneActor<CameraActor> {
  camera?: CameraActor;

  private readonly panSpeedScalar = 0.01;
  private readonly moveSpeedScalar = 1;
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

    app.mouse.on("mousemove", this.onMouseMove());
    app.keyboard.on("keydown", this.onKeyDown());
    app.keyboard.on("keyup", this.onKeyUp());

    return super.init(camera);
  }

  update(dt: number) {
    if (this.isMoving) {
      const pos = this.camera?.entity?.getPosition();
      if (pos && this.currentMoveDir !== 0) {
        const amount = dt * this.moveSpeedScalar;
        pos.z -= amount * +hasDirection(this.currentMoveDir, Direction.FORWARD);
        pos.x -= amount * +hasDirection(this.currentMoveDir, Direction.RIGHT);
        pos.z += amount * +hasDirection(this.currentMoveDir, Direction.BACK);
        pos.x += amount * +hasDirection(this.currentMoveDir, Direction.LEFT);
        pos.y += amount * +hasDirection(this.currentMoveDir, Direction.UP);
        pos.y -= amount * +hasDirection(this.currentMoveDir, Direction.DOWN);

        this.camera?.entity?.setPosition(pos);
      }
    }
  }

  private onMouseMove(): pc.HandleEventCallback {
    return (evt) => {
      if (app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        if (evt.dx && evt.dy) {
          const pos = this.camera?.entity?.getPosition();
          if (pos) {
            pos.x -= evt.dx * this.panSpeedScalar;
            pos.y += evt.dy * this.panSpeedScalar;
            this.camera?.entity?.setPosition(pos);
          }
        }
      }
    };
  }

  private onKeyDown(): pc.HandleEventCallback {
    return (evt) => {
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
    };
  }

  private onKeyUp(): pc.HandleEventCallback {
    return (evt) => {
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
    };
  }
}
