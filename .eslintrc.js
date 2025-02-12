// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
  root: true,
    extends: [
      'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    ],
    rules: {
      // Disable unused variables warning
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
      
      // Allow empty interfaces
      '@typescript-eslint/no-empty-interface': 'warn',
      
      // Reduce strictness of type checking
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      
      // Allow unused function parameters
      '@typescript-eslint/no-unused-params': 'off',
      
      // Other common rules to make development easier
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      
      // React specific rules
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off'
    },
    ignorePatterns: [
      'node_modules/',
      '.next/',
      'out/',
      'public/',
      '**/*.js',
      '**/*.json',
      '**/*.css',
      '**/*.scss'
    ]
  }