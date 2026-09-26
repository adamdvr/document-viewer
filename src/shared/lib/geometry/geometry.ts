/** Точка в локальной системе координат (например, страницы документа). */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** Точка в координатах viewport — совместима с `MouseEvent` и `PointerEvent`. */
export interface ClientPoint {
  readonly clientX: number;
  readonly clientY: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Ограничивает точку прямоугольником `[0, bounds.width] × [0, bounds.height]`. */
export function clampPoint(point: Point, bounds: Size): Point {
  return {
    x: clamp(point.x, 0, Math.max(bounds.width, 0)),
    y: clamp(point.y, 0, Math.max(bounds.height, 0)),
  };
}

export function centerOf({ width, height }: Size): Point {
  return { x: width / 2, y: height / 2 };
}
