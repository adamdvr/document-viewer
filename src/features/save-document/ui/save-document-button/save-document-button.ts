import { Component, inject, input } from '@angular/core';

import { AnnotationsStore } from '@entities/annotation';
import { DocumentInfo } from '@entities/document';
import { Button, ButtonVariant } from '@shared/ui';

import { SaveDocumentApi } from '../../api/save-document-api';
import { toSaveDocumentPayload } from '../../model/save-document-payload';

@Component({
  selector: 'app-save-document-button',
  imports: [Button],
  templateUrl: './save-document-button.html',
})
export class SaveDocumentButton {
  readonly documentInfo = input.required<DocumentInfo>();

  private readonly annotations = inject(AnnotationsStore);
  private readonly saveDocumentApi = inject(SaveDocumentApi);

  protected readonly ButtonVariant = ButtonVariant;

  protected save(): void {
    this.saveDocumentApi.save(toSaveDocumentPayload(this.documentInfo(), this.annotations.all()));
  }
}
