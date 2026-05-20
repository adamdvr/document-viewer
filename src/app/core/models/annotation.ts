export interface Annotation {
  readonly id: string;
  readonly pageNumber: number;
  readonly x: number;
  readonly y: number;
  readonly text: string;
}

export interface AnnotationPlacement {
  readonly pageNumber: number;
  readonly x: number;
  readonly y: number;
}

export interface AnnotationPositionUpdate {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

export interface AnnotationTextUpdate {
  readonly id: string;
  readonly text: string;
}
