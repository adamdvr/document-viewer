// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const boundaries = require('eslint-plugin-boundaries');

/**
 * Слои Feature-Sliced Design сверху вниз. Слой импортирует только слои ниже себя,
 * слайсы одного слоя друг друга не видят. У shared слайсов нет: его сегменты
 * (ui, lib, config) могут использовать друг друга.
 */
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'];
const SLICED_LAYERS = ['pages', 'widgets', 'features', 'entities'];

const allowedTargets = (layer) =>
  layer === 'shared' ? ['shared'] : LAYERS.slice(LAYERS.indexOf(layer) + 1);

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      // Компоненты-элементы и компоненты на нативных элементах (`button[appButton]`).
      '@angular-eslint/component-selector': [
        'error',
        [
          { type: 'element', prefix: 'app', style: 'kebab-case' },
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
      ],
      // Современный Angular: inject(), сигнальные input/output/queries.
      // prefer-on-push-component-change-detection не нужен — OnPush по умолчанию с v22.
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      'no-console': ['error', { allow: ['error'] }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // IconButton получает доступное имя из обязательного input `label` (→ aria-label).
      '@angular-eslint/template/elements-content': ['error', { allowList: ['label'] }],
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-contextual-for-variables': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-template-literal': 'error',
    },
  },
  {
    // Архитектурные границы FSD.
    files: ['src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        ...SLICED_LAYERS.map((layer) => ({
          type: layer,
          pattern: `src/${layer}/*`,
          capture: ['slice'],
        })),
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
      ],
      'boundaries/ignore': ['src/main.ts'],
    },
    rules: {
      // Каждый файл обязан принадлежать слою.
      'boundaries/no-unknown-files': 'error',
      // Импорт только в нижние слои и только через public API (index.ts) слайса/сегмента.
      // Импорты внутри слайса не проверяются — это его внутреннее устройство.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            'FSD: импортировать можно только нижние слои и только через public API (index.ts); ' +
            'слайсы одного слоя друг друга не импортируют.',
          policies: LAYERS.map((layer) => ({
            from: { element: { type: layer } },
            allow: {
              to: {
                element: {
                  types: { anyOf: allowedTargets(layer) },
                  fileInternalPath: 'index.ts',
                },
              },
            },
          })),
        },
      ],
      // Между слоями — только алиасы (@entities/…), относительные пути прячут зависимости.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(\\.\\./)+(app|pages|widgets|features|entities|shared)(/|$)',
              message:
                'Импорт из другого слоя — через алиас (@pages, @widgets, @features, @entities, @shared).',
            },
          ],
        },
      ],
    },
  },
]);
