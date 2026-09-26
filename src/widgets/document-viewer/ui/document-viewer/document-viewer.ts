import { Component, inject, input } from '@angular/core';

import {
  AddAnnotationButton,
  AnnotationPlacementLayer,
  AnnotationPlacementStore,
} from '@features/add-annotation';
import { AnnotationEditor } from '@features/edit-annotation';
import { SaveDocumentButton } from '@features/save-document';
import { ZoomControls, ZoomStore } from '@features/zoom-document';
import { AnnotationsStore } from '@entities/annotation';
import { DocumentInfo, PageView } from '@entities/document';
import { Toolbar } from '@shared/ui';

/**
 * Просмотрщик загруженного документа: тулбар и страницы с аннотациями.
 *
 * Компонент — граница состояния документа: сторы предоставляются здесь и живут ровно
 * столько, сколько открыт документ. Страница пересоздаёт виджет при смене документа,
 * поэтому состояние одного документа не может «протечь» в другой.
 */
@Component({
  selector: 'app-document-viewer',
  imports: [
    Toolbar,
    ZoomControls,
    AddAnnotationButton,
    SaveDocumentButton,
    PageView,
    AnnotationEditor,
    AnnotationPlacementLayer,
  ],
  templateUrl: './document-viewer.html',
  styleUrl: './document-viewer.scss',
  providers: [AnnotationsStore, AnnotationPlacementStore, ZoomStore],
})
export class DocumentViewer {
  readonly documentInfo = input.required<DocumentInfo>();

  protected readonly annotations = inject(AnnotationsStore);
  protected readonly placement = inject(AnnotationPlacementStore);
  protected readonly zoom = inject(ZoomStore);
}
