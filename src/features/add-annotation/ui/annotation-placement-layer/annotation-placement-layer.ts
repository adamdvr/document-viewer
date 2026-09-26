import { Component, inject } from '@angular/core';

import { PageSurface } from '@entities/document';
import { centerOf } from '@shared/lib';

import { AnnotationPlacementStore } from '../../model/annotation-placement-store';

/**
 * Прозрачный слой поверх страницы в режиме размещения. Проецируется в `PageView`
 * и получает от него `PageSurface` — номер страницы и пересчёт координат.
 */
@Component({
  selector: 'app-annotation-placement-layer',
  templateUrl: './annotation-placement-layer.html',
  styleUrl: './annotation-placement-layer.scss',
})
export class AnnotationPlacementLayer {
  private readonly surface = inject(PageSurface);
  private readonly placement = inject(AnnotationPlacementStore);

  protected readonly pageNumber = this.surface.pageNumber;

  protected place(event: MouseEvent): void {
    // Enter/Space на кнопке порождают click без координат (detail === 0):
    // с клавиатуры аннотация ставится в центр страницы.
    const position =
      event.detail === 0 ? centerOf(this.surface.size()) : this.surface.toPagePoint(event);
    this.placement.place(this.pageNumber(), position);
  }
}
