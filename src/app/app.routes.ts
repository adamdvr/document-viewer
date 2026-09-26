import { Routes } from '@angular/router';

const DEFAULT_DOCUMENT_ID = '1';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `documents/${DEFAULT_DOCUMENT_ID}`,
  },
  {
    path: 'documents/:id',
    title: 'Просмотр документа',
    loadComponent: () => import('@pages/document-viewer').then((m) => m.DocumentViewerPage),
  },
  {
    path: '**',
    redirectTo: `documents/${DEFAULT_DOCUMENT_ID}`,
  },
];
