import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'documents/1',
  },
  {
    path: 'documents/:id',
    loadComponent: () =>
      import('./features/document-viewer/document-viewer').then(
        (m) => m.DocumentViewer,
      ),
  },
  {
    path: '**',
    redirectTo: 'documents/1',
  },
];
