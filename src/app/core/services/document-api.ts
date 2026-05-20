import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentApi {
  documentUrl(id: string): string {
    return `api/documents/${id}.json`;
  }
}
