import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import {
  Annotation,
  AnnotationPlacement,
  AnnotationPositionUpdate,
  AnnotationTextUpdate,
} from '../../../core/models/annotation';
import { AnnotationItem } from '../annotation/annotation-item';

const BASE_PAGE_WIDTH = 800;
const FALLBACK_PAGE_HEIGHT = 1130;

@Component({
  selector: 'app-document-page',
  imports: [AnnotationItem],
  templateUrl: './document-page.html',
  styleUrl: './document-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentPageView {
  readonly pageNumber = input.required<number>();
  readonly imageUrl = input.required<string>();
  readonly zoom = input.required<number>();
  readonly annotations = input.required<readonly Annotation[]>();
  readonly placingAnnotation = input.required<boolean>();

  readonly annotationAdded = output<AnnotationPlacement>();
  readonly annotationMoved = output<AnnotationPositionUpdate>();
  readonly annotationTextChanged = output<AnnotationTextUpdate>();
  readonly annotationDeleted = output<string>();

  protected readonly baseWidth = BASE_PAGE_WIDTH;
  protected readonly baseHeight = signal(FALLBACK_PAGE_HEIGHT);

  protected readonly pageAnnotations = computed(() =>
    this.annotations().filter((a) => a.pageNumber === this.pageNumber()),
  );

  private readonly pageRef = viewChild.required<ElementRef<HTMLDivElement>>('page');

  protected onImageLoaded(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth > 0) {
      this.baseHeight.set(
        Math.round((img.naturalHeight * this.baseWidth) / img.naturalWidth),
      );
    }
  }

  protected onPlaceClick(event: MouseEvent): void {
    if (!this.placingAnnotation()) {
      return;
    }
    const rect = this.pageRef().nativeElement.getBoundingClientRect();
    const zoom = this.zoom();
    const x = (event.clientX - rect.left) / zoom;
    const y = (event.clientY - rect.top) / zoom;
    this.annotationAdded.emit({
      pageNumber: this.pageNumber(),
      x,
      y,
    });
  }
}
