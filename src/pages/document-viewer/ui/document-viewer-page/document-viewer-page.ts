import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { DocumentViewer } from '@widgets/document-viewer';
import { DocumentApi } from '@entities/document';
import { Button, ButtonVariant, Spinner, StatusMessage, StatusTone } from '@shared/ui';

/** Маршрут `documents/:id`: загружает документ и показывает загрузку, ошибку или просмотрщик. */
@Component({
  selector: 'app-document-viewer-page',
  imports: [DocumentViewer, Button, Spinner, StatusMessage],
  templateUrl: './document-viewer-page.html',
  styleUrl: './document-viewer-page.scss',
})
export class DocumentViewerPage {
  /** Параметр маршрута `:id` (`withComponentInputBinding`). */
  readonly id = input.required<string>();

  private readonly documentApi = inject(DocumentApi);

  protected readonly ButtonVariant = ButtonVariant;
  protected readonly StatusTone = StatusTone;

  protected readonly documentResource = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.documentApi.getDocument(id),
  });
}
