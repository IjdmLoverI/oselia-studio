import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
  {
    ignores: [
      '.next/',
      'src/payload-types.ts',
      'src/migrations/',
      'src/app/(payload)/',
      'playwright-report/',
      'test-results/',
    ],
  },
]

export default config
