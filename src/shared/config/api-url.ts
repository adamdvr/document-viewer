import { InjectionToken } from '@angular/core';

/**
 * Базовый URL API. По умолчанию — мок-бэкенд из статических JSON в `public/api`;
 * путь относительный, поэтому работает и на GitHub Pages. Для реального бэкенда
 * достаточно переопределить токен в `app.config.ts`.
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'api',
});
