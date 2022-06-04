export enum Direction {
  NONE = 0,
  FORWARD = 1 << 0,
  RIGHT = 1 << 1,
  BACK = 1 << 2,
  LEFT = 1 << 3,
  UP = 1 << 4,
  DOWN = 1 << 5,
}

export function prettyDirection(direction: Direction): string {
  const count = Object.entries(Direction).length / 2;
  const directions: Array<string> = [];
  for (let i = 0; i < count; i++) {
    if (i >= 0) {
      const flag = 1 << i;
      if ((direction & flag) > 0) {
        directions.push(Direction[1 << i]);
      }
    }
  }

  return directions.join(", ");
}

export function hasDirection(
  questionable: Direction,
  targetDir: Direction
): boolean {
  return (questionable & targetDir) > 0;
}
