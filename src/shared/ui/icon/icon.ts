import { Component, computed, input } from '@angular/core';

interface IconDefinition {
  readonly path: string;
  readonly strokeWidth: number;
}

// Иконки рисуются штрихом в сетке 16×16. Точки ручки — отрезки нулевой длины
// с круглыми концами: одна техника отрисовки для всего набора.
const ICONS = {
  plus: { path: 'M8 3.5v9M3.5 8h9', strokeWidth: 1.75 },
  minus: { path: 'M3.5 8h9', strokeWidth: 1.75 },
  close: { path: 'M4.5 4.5l7 7M11.5 4.5l-7 7', strokeWidth: 1.75 },
  grip: { path: 'M6 4h0M10 4h0M6 8h0M10 8h0M6 12h0M10 12h0', strokeWidth: 3 },
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof ICONS;

/** Декоративная иконка размером 1em. Доступное имя задаёт элемент, в котором она лежит. */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  host: { 'aria-hidden': 'true' },
})
export class Icon {
  readonly name = input.required<IconName>();

  protected readonly icon = computed<IconDefinition>(() => ICONS[this.name()]);
}
