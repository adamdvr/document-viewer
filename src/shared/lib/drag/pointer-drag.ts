import { Directive, ElementRef, inject, output, signal } from '@angular/core';

import { ClientPoint } from '../geometry/geometry';

/**
 * Перетаскивание указателем (мышь, перо, касание) через pointer capture: после захвата
 * события приходят на элемент, даже когда указатель ушёл за его пределы.
 *
 * Директива ничего не знает о предметной области и сообщает только координаты указателя
 * в viewport — перевод в координаты модели остаётся на потребителе.
 */
@Directive({
  selector: '[appPointerDrag]',
  host: {
    style: 'touch-action: none',
    '(pointerdown)': 'start($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'end($event)',
    '(lostpointercapture)': 'end($event)',
    '(pointercancel)': 'cancel($event)',
  },
})
export class PointerDrag {
  readonly dragStart = output<ClientPoint>();
  readonly dragMove = output<ClientPoint>();
  /** Перетаскивание завершено: указатель отпущен. */
  readonly dragEnd = output<void>();
  /** Перетаскивание прервано системой (`pointercancel`): результат нужно откатить. */
  readonly dragCancel = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly activePointerId = signal<number | null>(null);

  protected start(event: PointerEvent): void {
    if (event.button !== 0 || this.activePointerId() !== null) {
      return;
    }
    // Без этого браузер начнёт выделение текста или нативный drag изображения.
    event.preventDefault();
    this.host.nativeElement.setPointerCapture(event.pointerId);
    this.activePointerId.set(event.pointerId);
    this.dragStart.emit(toClientPoint(event));
  }

  protected move(event: PointerEvent): void {
    if (this.isActive(event)) {
      this.dragMove.emit(toClientPoint(event));
    }
  }

  /** Идемпотентно: после `pointerup` браузер присылает ещё и `lostpointercapture`. */
  protected end(event: PointerEvent): void {
    if (this.isActive(event)) {
      this.activePointerId.set(null);
      this.dragEnd.emit();
    }
  }

  protected cancel(event: PointerEvent): void {
    if (this.isActive(event)) {
      this.activePointerId.set(null);
      this.dragCancel.emit();
    }
  }

  private isActive(event: PointerEvent): boolean {
    return event.pointerId === this.activePointerId();
  }
}

function toClientPoint({ clientX, clientY }: PointerEvent): ClientPoint {
  return { clientX, clientY };
}
