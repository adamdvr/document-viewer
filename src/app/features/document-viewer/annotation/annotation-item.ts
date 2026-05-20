import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

import {
  Annotation,
  AnnotationPositionUpdate,
  AnnotationTextUpdate,
} from '../../../core/models/annotation';

@Component({
  selector: 'app-annotation-item',
  templateUrl: './annotation-item.html',
  styleUrl: './annotation-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'annotation',
    '[class.annotation--dragging]': 'dragging()',
    '[style.left.px]': 'annotation().x',
    '[style.top.px]': 'annotation().y',
  },
})
export class AnnotationItem {
  readonly annotation = input.required<Annotation>();
  readonly zoom = input.required<number>();

  readonly moved = output<AnnotationPositionUpdate>();
  readonly textChanged = output<AnnotationTextUpdate>();
  readonly deleted = output<string>();

  protected readonly dragging = signal(false);

  private startX = 0;
  private startY = 0;
  private startPointerX = 0;
  private startPointerY = 0;

  protected onHandlePointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget as HTMLElement;
    handle.setPointerCapture(event.pointerId);

    const { x, y } = this.annotation();
    this.startX = x;
    this.startY = y;
    this.startPointerX = event.clientX;
    this.startPointerY = event.clientY;
    this.dragging.set(true);
  }

  protected onHandlePointerMove(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const handle = event.currentTarget as HTMLElement;
    if (!handle.hasPointerCapture(event.pointerId)) {
      return;
    }

    const zoom = this.zoom();
    const dx = (event.clientX - this.startPointerX) / zoom;
    const dy = (event.clientY - this.startPointerY) / zoom;

    this.moved.emit({
      id: this.annotation().id,
      x: this.startX + dx,
      y: this.startY + dy,
    });
  }

  protected onHandlePointerUp(event: PointerEvent): void {
    if (!this.dragging()) {
      return;
    }
    const handle = event.currentTarget as HTMLElement;
    if (handle.hasPointerCapture(event.pointerId)) {
      handle.releasePointerCapture(event.pointerId);
    }
    this.dragging.set(false);
  }

  protected onTextInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.textChanged.emit({ id: this.annotation().id, text: value });
  }

  protected onDelete(): void {
    this.deleted.emit(this.annotation().id);
  }
}
