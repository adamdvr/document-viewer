import { Component, input } from '@angular/core';

export enum ButtonVariant {
  /** Главное действие. */
  Primary = 'primary',
  /** Второстепенное действие. */
  Outline = 'outline',
  /** Выбранное состояние / активный режим. */
  Tonal = 'tonal',
}

/**
 * Текстовая кнопка. Висит на нативном `<button>`, поэтому семантика, фокус, `type` и
 * `disabled` остаются браузерными — компонент добавляет только оформление.
 */
@Component({
  selector: 'button[appButton]',
  template: '<ng-content />',
  styleUrl: './button.scss',
  host: { '[attr.data-variant]': 'variant()' },
})
export class Button {
  readonly variant = input(ButtonVariant.Outline);
}
