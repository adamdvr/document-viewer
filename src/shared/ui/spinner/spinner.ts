import { Component } from '@angular/core';

/** Индикатор загрузки. Декоративный: о самом состоянии сообщает текст рядом. */
@Component({
  selector: 'app-spinner',
  template: '',
  styleUrl: './spinner.scss',
  host: { 'aria-hidden': 'true' },
})
export class Spinner {}
