import { Component, input } from '@angular/core';

/** `primary` — главное действие, `outline` — второстепенное, `tonal` — выбранное / активный режим. */
export type ButtonVariant = 'primary' | 'outline' | 'tonal';

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
  readonly variant = input<ButtonVariant>('outline');
}
