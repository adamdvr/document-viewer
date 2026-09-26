import { Component, input } from '@angular/core';

import { Icon, IconName } from '../icon/icon';

/**
 * Круглая кнопка с иконкой. `label` обязателен: у кнопки без текста доступное имя
 * появляется по построению, а не по памяти разработчика.
 */
@Component({
  selector: 'button[appIconButton]',
  imports: [Icon],
  template: '<app-icon [name]="icon()" />',
  styleUrl: './icon-button.scss',
  host: {
    '[attr.aria-label]': 'label()',
    '[attr.title]': 'label()',
  },
})
export class IconButton {
  readonly icon = input.required<IconName>();
  readonly label = input.required<string>();
}
