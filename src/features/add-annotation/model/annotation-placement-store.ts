import { Service, inject, signal } from '@angular/core';

import { AnnotationsStore } from '@entities/annotation';
import { Point } from '@shared/lib';

/**
 * Режим размещения новой аннотации: кнопка в тулбаре включает его,
 * клик по странице ставит аннотацию и выключает режим.
 */
@Service({ autoProvided: false })
export class AnnotationPlacementStore {
  private readonly annotations = inject(AnnotationsStore);
  private readonly isActive = signal(false);

  readonly active = this.isActive.asReadonly();

  toggle(): void {
    this.isActive.update((active) => !active);
  }

  cancel(): void {
    this.isActive.set(false);
  }

  place(pageNumber: number, position: Point): void {
    this.annotations.add(pageNumber, position);
    this.isActive.set(false);
  }
}
