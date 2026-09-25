import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_URL } from '@shared/config';

import { DocumentInfo } from '../model/document';

/** Контракт ответа `GET {API_URL}/documents/:id`. Наружу слайса не экспортируется. */
interface DocumentDto {
  readonly name: string;
  readonly pages: readonly DocumentPageDto[];
}

interface DocumentPageDto {
  readonly number: number;
  readonly imageUrl: string;
}

@Service()
export class DocumentApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  getDocument(id: string): Observable<DocumentInfo> {
    // Мок-бэкенд — статические файлы, отсюда расширение .json в пути.
    const url = `${this.apiUrl}/documents/${encodeURIComponent(id)}.json`;
    return this.http.get<DocumentDto>(url).pipe(map((dto) => toDocumentInfo(id, dto)));
  }
}

function toDocumentInfo(id: string, dto: DocumentDto): DocumentInfo {
  return {
    id,
    name: dto.name,
    pages: dto.pages.map(({ number, imageUrl }) => ({ number, imageUrl })),
  };
}
