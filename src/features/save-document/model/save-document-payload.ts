import { Annotation } from '@entities/annotation';
import { DocumentInfo } from '@entities/document';

/**
 * Итоговый документ для сохранения — формат из ТЗ: `{ id, name, pages, annotations }`.
 * Сущности `document` и `annotation` друг о друге не знают, связывает их этот сценарий.
 */
export interface SaveDocumentPayload extends DocumentInfo {
  readonly annotations: readonly Annotation[];
}

export function toSaveDocumentPayload(
  documentInfo: DocumentInfo,
  annotations: readonly Annotation[],
): SaveDocumentPayload {
  return { ...documentInfo, annotations };
}
