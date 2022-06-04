import * as pc from "playcanvas";
import type { CameraActor } from "../actors/CameraActor";
import { SceneActor } from "../actors/SceneActor";
import { Direction, hasDirection, prettyDirection } from "./Direction";

export class CameraInput extends SceneActor<CameraActor> {
  camera?: CameraActor;

  private readonly panSpeedScalar = 1;
  private readonly moveSpeedScalar = 1;
  private currentMoveDir: Direction = Direction.NONE;
  private currentPanDelta: { dx: number; dy: number } = { dx: 0, dy: 0 };

  private isMoving = false;
  private isPanning = false;

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

  private readonly axisMappings = {
    [Direction.FORWARD]: Direction.BACK,
    [Direction.BACK]: Direction.FORWARD,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
  };

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
        console.log(this.currentMoveDir, prettyDirection(this.currentMoveDir));
      }
    }

    if (this.isPanning) {
      const pos = this.camera?.entity?.getPosition();
      if (pos) {
        pos.x -= this.currentPanDelta.dx * dt * this.panSpeedScalar;
        pos.y += this.currentPanDelta.dy * dt * this.panSpeedScalar;
        this.camera?.entity?.setPosition(pos);
      }
    }
  }

  private onMouseMove(): pc.HandleEventCallback {
    return (evt) => {
      if (app.mouse.isPressed(pc.MOUSEBUTTON_LEFT)) {
        this.isPanning = true;
        if (evt.dx && evt.dy) {
          this.currentPanDelta.dx = evt.dx;
          this.currentPanDelta.dy = evt.dy;
        }
      } else {
        this.isPanning = false;
      }
    };
  }

  private onKeyDown(): pc.HandleEventCallback {
    return (evt) => {
      this.keyMapping.forEach((map) => {
        if (
          app.keyboard.isPressed(map.key) &&
          hasDirection(this.currentMoveDir, map.direction) === false
        ) {
          const inverseDir = this.axisMappings[map.direction];
          if (hasDirection(this.currentMoveDir, inverseDir)) {
            this.currentMoveDir -= inverseDir;
          }

          this.currentMoveDir += map.direction;
        }
      });

      this.updateKeyInput(() => {
        this.isMoving = true;
        evt.event.preventDefault();
      });
    };
  }

  private onKeyUp(): pc.HandleEventCallback {
    return (evt) => {
      this.keyMapping.forEach((map) => {
        if (
          !app.keyboard.isPressed(map.key) &&
          hasDirection(this.currentMoveDir, map.direction)
        ) {
          this.currentMoveDir -= map.direction;
        }
      });

      this.updateKeyInput(() => {
        this.isMoving = false;
        evt.event.preventDefault();
      });
    };
  }

  private updateKeyInput(update: () => void) {
    if (this.currentMoveDir > Direction.NONE) {
      update();
    }
  }
}
