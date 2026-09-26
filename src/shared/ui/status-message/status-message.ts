import { Component, computed, input } from '@angular/core';

export enum StatusTone {
  Info = 'info',
  Error = 'error',
}

const ROLE_BY_TONE: Record<StatusTone, string> = {
  [StatusTone.Info]: 'status',
  [StatusTone.Error]: 'alert',
};

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
  readonly tone = input(StatusTone.Info);

  protected readonly role = computed(() => ROLE_BY_TONE[this.tone()]);
}
