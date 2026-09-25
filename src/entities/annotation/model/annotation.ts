export interface Annotation {
  readonly id: string;
  readonly pageNumber: number;
  /** Левый верхний угол в базовой системе координат страницы — не зависит от zoom. */
  readonly x: number;
  readonly y: number;
  readonly text: string;
}
