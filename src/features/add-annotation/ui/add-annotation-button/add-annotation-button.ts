import { Component, computed, inject } from '@angular/core';

import { Button, ButtonVariant } from '@shared/ui';

import { AnnotationPlacementStore } from '../../model/annotation-placement-store';

interface ButtonView {
  readonly variant: ButtonVariant;
  readonly label: string;
  readonly hint: string | null;
}

const IDLE_VIEW: ButtonView = {
  variant: ButtonVariant.Outline,
  label: 'Добавить аннотацию',
  hint: null,
};

const PLACING_VIEW: ButtonView = {
  variant: ButtonVariant.Tonal,
  label: 'Отмена',
  hint: 'Esc — отменить размещение',
};

@Component({
  selector: 'app-add-annotation-button',
  imports: [Button],
  templateUrl: './add-annotation-button.html',
  host: { '(document:keydown.escape)': 'placement.cancel()' },
})
export class AddAnnotationButton {
  protected readonly placement = inject(AnnotationPlacementStore);

  protected readonly view = computed(() => (this.placement.active() ? PLACING_VIEW : IDLE_VIEW));
}
