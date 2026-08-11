import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

/**
 * ESLint 9 flat config.
 *
 * `eslint-config-next` 16 ships native flat-config arrays, so they are spread
 * directly. Routing them through `FlatCompat` — the pattern most Next
 * scaffolds still use — makes eslintrc re-serialize an already-flat config and
 * throws on the circular plugin references inside it.
 */

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'payload-types.ts',
      'app/(payload)/admin/importMap.js',
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    rules: {
      // The plan forbids untyped escape hatches without explicit justification.
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Accessibility is a release gate, not a suggestion (plan §14.5).
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',

      // Reader-facing images go through the governed EditorialImage layer,
      // which is what enforces sizes, dimensions, and LCP priority.
      '@next/next/no-img-element': 'error',
    },
  },

  {
    // Migration and seed scripts run in Node and legitimately log progress.
    files: ['scripts/**/*.ts', 'tests/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]

export default config
