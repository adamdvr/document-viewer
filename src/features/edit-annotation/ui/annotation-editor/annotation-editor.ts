import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { Annotation, AnnotationsStore } from '@entities/annotation';
import { PageSurface } from '@entities/document';
import { ClientPoint, Point, PointerDrag, Size, clampPoint } from '@shared/lib';
import { Icon } from '@shared/ui';

interface DragSession {
  /** Смещение точки захвата от левого верхнего угла аннотации. */
  readonly grabOffset: Point;
  /** Допустимая область для левого верхнего угла: аннотация целиком остаётся на странице. */
  readonly bounds: Size;
}

/** Сдвиг стрелками в координатах страницы; с Shift — крупный шаг. */
const NUDGE_STEP = { regular: 8, large: 40 } as const;

const NUDGE_DIRECTIONS: Partial<Record<string, Point>> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
};

/**
 * Аннотация на странице: перемещение за ручку или стрелками, редактирование текста, удаление.
 * Проецируется в `PageView` и через `PageSurface` работает в координатах страницы.
 */
@Component({
  selector: 'app-annotation-editor',
  imports: [PointerDrag, Icon],
  templateUrl: './annotation-editor.html',
  styleUrl: './annotation-editor.scss',
  host: {
    '[style.left.px]': 'position().x',
    '[style.top.px]': 'position().y',
    '[class.dragging]': 'dragging()',
  },
})
export class AnnotationEditor {
  readonly annotation = input.required<Annotation>();

  private readonly annotations = inject(AnnotationsStore);
  private readonly surface = inject(PageSurface);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly textField = viewChild.required<ElementRef<HTMLTextAreaElement>>('textField');

  private readonly dragSession = signal<DragSession | null>(null);
  /** Позиция во время перетаскивания. В стор попадает один раз — при отпускании. */
  private readonly dragPosition = signal<Point | null>(null);

  protected readonly dragging = computed(() => this.dragSession() !== null);
  protected readonly position = computed<Point>(() => this.dragPosition() ?? this.annotation());

  constructor() {
    // Новая аннотация создаётся пустой — сразу переводим фокус в поле ввода. Иначе после
    // размещения с клавиатуры фокус пропал бы вместе со слоем размещения.
    afterNextRender(() => {
      if (!this.annotation().text) {
        this.textField().nativeElement.focus();
      }
    });
  }

  protected startDrag(pointer: ClientPoint): void {
    const grab = this.surface.toPagePoint(pointer);
    const { x, y } = this.position();
    this.dragSession.set({
      grabOffset: { x: grab.x - x, y: grab.y - y },
      bounds: this.movementBounds(),
    });
  }

  protected drag(pointer: ClientPoint): void {
    const session = this.dragSession();
    if (!session) {
      return;
    }
    const { x, y } = this.surface.toPagePoint(pointer);
    const { grabOffset, bounds } = session;
    this.dragPosition.set(clampPoint({ x: x - grabOffset.x, y: y - grabOffset.y }, bounds));
  }

  protected finishDrag(): void {
    const position = this.dragPosition();
    // Клик по ручке без движения ничего не меняет.
    if (position) {
      this.annotations.move(this.annotation().id, position);
    }
    this.resetDrag();
  }

  protected cancelDrag(): void {
    this.resetDrag();
  }

  protected nudge(event: KeyboardEvent): void {
    const direction = NUDGE_DIRECTIONS[event.key];
    if (!direction) {
      return;
    }
    // Стрелки не должны заодно прокручивать документ.
    event.preventDefault();
    const step = event.shiftKey ? NUDGE_STEP.large : NUDGE_STEP.regular;
    const { id, x, y } = this.annotation();
    const target = { x: x + direction.x * step, y: y + direction.y * step };
    this.annotations.move(id, clampPoint(target, this.movementBounds()));
  }

  protected updateText(text: string): void {
    this.annotations.updateText(this.annotation().id, text);
  }

  protected remove(): void {
    this.annotations.remove(this.annotation().id);
  }

  private movementBounds(): Size {
    const page = this.surface.size();
    // offsetWidth/offsetHeight — размер до CSS-масштабирования, то есть уже в координатах страницы.
    const { offsetWidth, offsetHeight } = this.host.nativeElement;
    return { width: page.width - offsetWidth, height: page.height - offsetHeight };
  }

  private resetDrag(): void {
    this.dragSession.set(null);
    this.dragPosition.set(null);
  }
}
