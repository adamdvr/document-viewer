import { Component, inject } from '@angular/core';

import { IconButton } from '@shared/ui';

import { ZoomStore } from '../../model/zoom-store';

@Component({
  selector: 'app-zoom-controls',
  imports: [IconButton],
  templateUrl: './zoom-controls.html',
  styleUrl: './zoom-controls.scss',
  host: { role: 'group', 'aria-label': 'Масштаб' },
})
export class ZoomControls {
  protected readonly zoom = inject(ZoomStore);
}
