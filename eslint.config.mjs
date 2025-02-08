import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginJsdoc from 'eslint-plugin-jsdoc'
import eslintPluginSecurity from 'eslint-plugin-security'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default [
    {
        ignores: ['node_modules/', 'dist/', '.env', 'eslint.config.mjs', '.vscode/', 'builds/' ],
    },
    {
        plugins: {
            prettier: eslintPluginPrettier,
            jsdoc: eslintPluginJsdoc,
            security: eslintPluginSecurity,
            unicorn: eslintPluginUnicorn,
        },

        files: ['**/*.{js,mjs,cjs,ts}'],
        languageOptions: {
            sourceType: 'commonjs',
            ecmaVersion: 2021,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'array-bracket-spacing': ['error', 'always'],
            'brace-style': ['error', 'allman', { allowSingleLine: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': ['error', { before: false, after: true }],
            eqeqeq: 'warn',
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    ignoredNodes: ['PropertyDefinition'],
                },
            ],
            'init-declarations': 'off',
            'linebreak-style': ['error', 'unix'],
            'no-cond-assign': ['error', 'always'],
            'no-console': 'off',
            'no-empty': 'off',
            'no-inline-comments': 'off',
            'object-curly-spacing': [
                'error',
                'always',
                { arraysInObjects: true, objectsInObjects: true },
            ],
            'one-var': 'off',
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
            'space-infix-ops': ['error', { int32Hint: false }],
            'space-before-blocks': [
                'error',
                { functions: 'always', keywords: 'always', classes: 'always' },
            ],
            'arrow-spacing': ['error', { before: true, after: true }],
            'switch-colon-spacing': 'error',
            'block-spacing': 'error',
            'space-unary-ops': [
                'error',
                {
                    words: true,
                    nonwords: false,
                    overrides: {
                        new: false,
                        '++': true,
                    },
                },
            ],
            'spaced-comment': [
                'error',
                'always',
                { markers: ['/'], exceptions: ['-'] },
            ],
            'keyword-spacing': 'error',
            'space-before-function-paren': [
                'error',
                { anonymous: 'always', named: 'never', asyncArrow: 'always' },
            ],
            'semi-spacing': ['error', { before: false, after: true }],
            'no-trailing-spaces': ['error', { ignoreComments: true }],
            'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
            strict: 'off',
            'no-spaced-func': 'error',
            'unicorn/filename-case': [
                'warn',
                {
                    cases: {
                        kebabCase: true,
                    },
                },
            ],
            'no-restricted-imports': [
                'error',
                {
                    paths: ['src'],
                    patterns: ['src/*'],
                },
            ],
            'no-eval': 'error',
            'unicorn/no-fn-reference-in-iterator': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/no-null': 'off',
            'unicorn/prefer-array-some': 'off',
            'unicorn/consistent-destructuring': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/prefer-module': 'off',
            'unicorn/prefer-spread': 'off',
            'unicorn/no-array-callback-reference': 'off',
            'unicorn/consistent-function-scoping': 'off',
            'unicorn/no-useless-undefined': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/prefer-node-protocol': 'off',
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/prevent-abbreviations': [
                'off',
                {
                    allowList: { Param: true, Req: true, Res: true },
                    ignore: ['\\.e2e-spec$', /^args/i, /^ignore/i],
                },
            ],
        },
        settings: {
            'import/extensions': ['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts'],
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        ignores: [ 'eslint.config.mjs', 'dist/' ],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                Atomics: "readonly",
                SharedArrayBuffer: "readonly",
            },
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        rules:     {
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { args: 'after-used', vars: 'all', varsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/camelcase': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: null,
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                    types: ['boolean'],
                    prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
                },
                {
                    selector: 'variableLike',
                    format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'parameter',
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'memberLike',
                    modifiers: ['private'],
                    format: ['camelCase'],
                    leadingUnderscore: 'allow',
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'property',
                    modifiers: ['readonly'],
                    format: ['camelCase', 'UPPER_CASE'],
                },
                // {
                //     selector: 'enumMember',
                //     format: [ 'PascalCase' ],
                // },
            ],
        },
    },
]
