import { Service } from '@angular/core';

import { SaveDocumentPayload } from '../model/save-document-payload';

/**
 * Бэкенд сохранения. По ТЗ сохранение — это вывод итогового документа в консоль.
 * Когда появится API, здесь будет HTTP-запрос, а потребители не изменятся.
 */
@Service()
export class SaveDocumentApi {
  save(payload: SaveDocumentPayload): void {
    // eslint-disable-next-line no-console -- требование ТЗ: результат сохранения выводится в консоль
    console.log(payload);
  }
}
