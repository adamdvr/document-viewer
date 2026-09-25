import { Component, inject } from '@angular/core';

import { Button } from '@shared/ui';

import { AnnotationPlacementStore } from '../../model/annotation-placement-store';

@Component({
  selector: 'app-add-annotation-button',
  imports: [Button],
  templateUrl: './add-annotation-button.html',
  host: { '(document:keydown.escape)': 'placement.cancel()' },
})
export class AddAnnotationButton {
  protected readonly placement = inject(AnnotationPlacementStore);
}
