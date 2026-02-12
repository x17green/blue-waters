import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default [
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/prisma/generated/**',
      '**/.husky/**',
      '**/coverage/**',
    ],
  },
  
  // Base JavaScript recommended rules
  js.configs.recommended,
  
  // Main configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        NodeJS: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/extensions': ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'import': importPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      // Import rules
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/order': [
        'warn',
        {
          'groups': ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          'pathGroups': [
            { 'pattern': '@/**', 'group': 'internal' },
            { 'pattern': '@/src/**', 'group': 'internal' },
            { 'pattern': '@/components/**', 'group': 'internal' },
            { 'pattern': '@/lib/**', 'group': 'internal' },
          ],
          'pathGroupsExcludedImportTypes': ['builtin'],
          'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
        },
      ],
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.js',
            '**/*.test.jsx',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.js',
            '**/*.spec.jsx',
            '**/*.spec.ts',
            '**/*.spec.tsx',
            '**/__tests__/**',
            '**/__mocks__/**',
            '*.config.js',
            '*.config.mjs',
            '*.config.ts',
            '.eslintrc.js',
            'postcss.config.mjs',
            'tailwind.config.ts',
            'next.config.mjs',
          ],
        },
      ],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          mjs: 'never',
        },
      ],
      'import/no-named-as-default-member': 'off',
      'import/prefer-default-export': 'off',

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',

      // React rules
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'semi': ['error', 'never'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-double'],

      // Import sorting
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
]
