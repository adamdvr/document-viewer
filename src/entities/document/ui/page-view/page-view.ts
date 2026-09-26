import { NgOptimizedImage } from '@angular/common';
import { Component, ElementRef, computed, input, signal, viewChild } from '@angular/core';

import { ClientPoint, Point, Size } from '@shared/lib';

import { DocumentPage } from '../../model/document';
import { DEFAULT_PAGE_ASPECT_RATIO, PAGE_BASE_WIDTH } from '../../model/page-geometry';
import { PageSurface } from './page-surface';

/**
 * Страница документа в заданном масштабе. Проецируемый контент лежит в базовой системе
 * координат страницы и масштабируется вместе с ней, а работать с этой системой
 * координат ему помогает `PageSurface`.
 */
@Component({
  selector: 'app-page-view',
  imports: [NgOptimizedImage],
  templateUrl: './page-view.html',
  styleUrl: './page-view.scss',
  providers: [{ provide: PageSurface, useExisting: PageView }],
})
export class PageView implements PageSurface {
  readonly page = input.required<DocumentPage>();
  readonly scale = input(1);
  /** Страница видна сразу после открытия: изображение грузится с высоким приоритетом, а не лениво. */
  readonly priority = input(false);

  private readonly aspectRatio = signal(DEFAULT_PAGE_ASPECT_RATIO);
  private readonly surface = viewChild.required<ElementRef<HTMLElement>>('surface');

  readonly pageNumber = computed(() => this.page().number);
  readonly size = computed<Size>(() => ({
    width: PAGE_BASE_WIDTH,
    height: Math.round(PAGE_BASE_WIDTH * this.aspectRatio()),
  }));

  protected readonly scaledSize = computed<Size>(() => {
    const { width, height } = this.size();
    return { width: width * this.scale(), height: height * this.scale() };
  });

  toPagePoint({ clientX, clientY }: ClientPoint): Point {
    // Масштаб берётся из фактического размера на экране, а не из input: пересчёт верен
    // и во время CSS-перехода zoom, и при прокрутке посреди перетаскивания.
    const rect = this.surface().nativeElement.getBoundingClientRect();
    const { width, height } = this.size();
    return {
      x: ((clientX - rect.left) * width) / rect.width,
      y: ((clientY - rect.top) * height) / rect.height,
    };
  }

  protected updateAspectRatio(image: HTMLImageElement): void {
    if (image.naturalWidth > 0) {
      this.aspectRatio.set(image.naturalHeight / image.naturalWidth);
    }
  }
}
