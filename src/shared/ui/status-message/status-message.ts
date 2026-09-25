import { Component, computed, input } from '@angular/core';

export type StatusTone = 'info' | 'error';

/**
 * Состояние экрана (загрузка, ошибка) по центру свободной области. Действия — через контент.
 * Ошибка объявляется скринридером сразу (`alert`), информационное сообщение — вежливо (`status`).
 */
@Component({
  selector: 'app-status-message',
  template: '<ng-content />',
  styleUrl: './status-message.scss',
  host: { '[attr.role]': 'role()' },
})
export class StatusMessage {
  readonly tone = input<StatusTone>('info');

  protected readonly role = computed(() => (this.tone() === 'error' ? 'alert' : 'status'));
}
