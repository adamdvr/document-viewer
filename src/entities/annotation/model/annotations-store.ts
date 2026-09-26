import { Service, computed, signal } from '@angular/core';

import { Point } from '@shared/lib';

import { Annotation } from './annotation';

const NO_ANNOTATIONS: readonly Annotation[] = [];

/**
 * Аннотации открытого документа. Не синглтон: предоставляется компонентом, который
 * отвечает за документ, и живёт ровно столько же, сколько он.
 *
 * Обновления иммутабельные — у нетронутых аннотаций сохраняется identity,
 * и OnPush-компоненты перерисовывают только изменившиеся.
 */
@Service({ autoProvided: false })
export class AnnotationsStore {
  private readonly items = signal<readonly Annotation[]>([]);

  readonly all = this.items.asReadonly();
  private readonly byPage = computed(() => groupByPage(this.items()));

  /** Аннотации страницы; реактивно, если вызывать в шаблоне или computed. */
  forPage(pageNumber: number): readonly Annotation[] {
    return this.byPage().get(pageNumber) ?? NO_ANNOTATIONS;
  }

  add(pageNumber: number, { x, y }: Point): void {
    const annotation: Annotation = { id: crypto.randomUUID(), pageNumber, x, y, text: '' };
    this.items.update((items) => [...items, annotation]);
  }

  move(id: string, { x, y }: Point): void {
    this.patch(id, { x, y });
  }

  updateText(id: string, text: string): void {
    this.patch(id, { text });
  }

  remove(id: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  private patch(id: string, changes: Partial<Omit<Annotation, 'id' | 'pageNumber'>>): void {
    this.items.update((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }
}

function groupByPage(
  annotations: readonly Annotation[],
): ReadonlyMap<number, readonly Annotation[]> {
  const groups = new Map<number, Annotation[]>();
  for (const annotation of annotations) {
    const group = groups.get(annotation.pageNumber);
    if (group) {
      group.push(annotation);
    } else {
      groups.set(annotation.pageNumber, [annotation]);
    }
  }
  return groups;
}
