import { Service, computed, signal } from '@angular/core';

import { clamp } from '@shared/lib';

/** Масштаб в процентах: целые шаги не накапливают ошибку округления float. */
const ZOOM_PERCENT = { min: 25, max: 300, step: 25, initial: 100 } as const;

@Service({ autoProvided: false })
export class ZoomStore {
  private readonly zoomPercent = signal<number>(ZOOM_PERCENT.initial);

  readonly percent = this.zoomPercent.asReadonly();
  readonly scale = computed(() => this.zoomPercent() / 100);
  readonly canZoomIn = computed(() => this.zoomPercent() < ZOOM_PERCENT.max);
  readonly canZoomOut = computed(() => this.zoomPercent() > ZOOM_PERCENT.min);

  zoomIn(): void {
    this.changeBy(ZOOM_PERCENT.step);
  }

  zoomOut(): void {
    this.changeBy(-ZOOM_PERCENT.step);
  }

  reset(): void {
    this.zoomPercent.set(ZOOM_PERCENT.initial);
  }

  private changeBy(delta: number): void {
    this.zoomPercent.update((percent) =>
      clamp(percent + delta, ZOOM_PERCENT.min, ZOOM_PERCENT.max),
    );
  }
}
