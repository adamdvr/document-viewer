import { Component } from '@angular/core';

/**
 * Верхняя панель с тремя слотами: `[toolbarStart]`, `[toolbarCenter]`, `[toolbarEnd]`.
 * Центр остаётся по центру экрана независимо от ширины крайних слотов.
 *
 * Роль `toolbar` не ставится намеренно: она обязывает реализовать навигацию стрелками.
 */
@Component({
  selector: 'header[appToolbar]',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {}
