import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['docs/**', 'node_modules/**', 'attached_assets/**', '.devspark/**', 'documentation/**', '.documentation/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
