import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-viewer-toolbar',
  templateUrl: './viewer-toolbar.html',
  styleUrl: './viewer-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerToolbar {
  readonly documentName = input<string | null>(null);
  readonly zoomPercent = input.required<number>();
  readonly canZoomIn = input.required<boolean>();
  readonly canZoomOut = input.required<boolean>();
  readonly placingAnnotation = input.required<boolean>();

  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly zoomReset = output<void>();
  readonly togglePlacing = output<void>();
  readonly save = output<void>();
}
