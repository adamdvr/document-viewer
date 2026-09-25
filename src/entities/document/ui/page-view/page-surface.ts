import { Signal } from '@angular/core';

import { ClientPoint, Point, Size } from '@shared/lib';

/**
 * Контракт отрендеренной страницы для контента, который в неё проецируется
 * (аннотации, слои взаимодействия). Предоставляется `PageView` через DI, поэтому
 * потребители зависят от абстракции, а не от конкретного компонента.
 *
 * Все координаты — в базовой системе страницы (см. `PAGE_BASE_WIDTH`) и не зависят от zoom.
 */
export abstract class PageSurface {
  abstract readonly pageNumber: Signal<number>;
  abstract readonly size: Signal<Size>;

  /** Переводит положение указателя из координат viewport в координаты страницы. */
  abstract toPagePoint(pointer: ClientPoint): Point;
}
