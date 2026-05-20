import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';

import {
  Annotation,
  AnnotationPlacement,
  AnnotationPositionUpdate,
  AnnotationTextUpdate,
} from '../../core/models/annotation';
import { DocumentApi } from '../../core/services/document-api';
import { DocumentInfo } from '../../core/models/document';
import { DocumentPageView } from './page/document-page';
import { ViewerToolbar } from './toolbar/viewer-toolbar';

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

@Component({
  selector: 'app-document-viewer',
  imports: [ViewerToolbar, DocumentPageView],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewer {
  private readonly api = inject(DocumentApi);

  readonly id = input.required<string>();

  protected readonly documentResource = httpResource<DocumentInfo>(() =>
    this.api.documentUrl(this.id()),
  );

  protected readonly zoom = signal(1);
  protected readonly zoomPercent = computed(() =>
    Math.round(this.zoom() * 100),
  );
  protected readonly canZoomIn = computed(() => this.zoom() < MAX_ZOOM);
  protected readonly canZoomOut = computed(() => this.zoom() > MIN_ZOOM);

  protected readonly placingAnnotation = signal(false);

  protected readonly annotations = signal<readonly Annotation[]>([]);

  protected zoomIn(): void {
    this.zoom.update((value) =>
      Math.min(MAX_ZOOM, Math.round((value + ZOOM_STEP) * 100) / 100),
    );
  }

  protected zoomOut(): void {
    this.zoom.update((value) =>
      Math.max(MIN_ZOOM, Math.round((value - ZOOM_STEP) * 100) / 100),
    );
  }

  protected resetZoom(): void {
    this.zoom.set(1);
  }

  protected togglePlacing(): void {
    this.placingAnnotation.update((value) => !value);
  }

  protected onAnnotationAdded(event: AnnotationPlacement): void {
    const annotation: Annotation = {
      id: crypto.randomUUID(),
      pageNumber: event.pageNumber,
      x: event.x,
      y: event.y,
      text: '',
    };
    this.annotations.update((list) => [...list, annotation]);
    this.placingAnnotation.set(false);
  }

  protected onAnnotationMoved(event: AnnotationPositionUpdate): void {
    this.annotations.update((list) =>
      list.map((a) =>
        a.id === event.id ? { ...a, x: event.x, y: event.y } : a,
      ),
    );
  }

  protected onAnnotationTextChanged(event: AnnotationTextUpdate): void {
    this.annotations.update((list) =>
      list.map((a) => (a.id === event.id ? { ...a, text: event.text } : a)),
    );
  }

  protected onAnnotationDeleted(id: string): void {
    this.annotations.update((list) => list.filter((a) => a.id !== id));
  }

  protected save(): void {
    const document = this.documentResource.value();
    if (!document) {
      return;
    }
    const payload = {
      id: this.id(),
      name: document.name,
      pages: document.pages,
      annotations: this.annotations(),
    };
    console.log('Saved document with annotations:', payload);
  }

  protected reload(): void {
    this.documentResource.reload();
  }
}
