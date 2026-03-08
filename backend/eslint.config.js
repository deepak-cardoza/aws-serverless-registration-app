const js = require('@eslint/js')
const tsParser = require('@typescript-eslint/parser') // Import tsParser
const tsPlugin = require('@typescript-eslint/eslint-plugin')

module.exports = [
    {
        // Ignore node_modules and dist folders
        ignores: ['node_modules/**', '**/dist/**'],
    },
    {
        // Special configuration for ESLint config files (eslint.config.js)
        files: ['eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'script', // CommonJS modules
            globals: {
                module: 'readonly',
                __dirname: 'readonly',
                require: 'readonly',
            },
        },
    },
    {
        // Apply to TypeScript files
        files: ['**/*.ts', '**/*.tsx', '**/**/*.ts'], // Target TypeScript files
        languageOptions: {
            ecmaVersion: 2021, // Latest ECMAScript features
            sourceType: 'module', // Use ES Modules syntax
            globals: {
                browser: true,
                commonjs: true, // Support CommonJS globals like `require`
                node: true, // Node.js globals like `process`
                console: 'readonly',
                process: 'readonly',
            },
            parser: tsParser, // Use TypeScript parser
            parserOptions: {
                project: './tsconfig.json', // Required for type-checking rules
                tsconfigRootDir: __dirname,
            },

        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: require('eslint-plugin-import'), // Add import plugin
        },
        rules: {
            // General rules
            indent: ['error', 4],
            'max-len': ['error', { code: 320 }],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            semi: ['error', 'never'],

            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',

            // Import rules
            'import/no-unresolved': 'warn', // Enable no-unresolved rule
        },
    },
    {
        // Apply to JavaScript files
        files: ['**/*.js'], // Target JavaScript files
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs', // Use CommonJS syntax
            globals: {
                browser: true,
                commonjs: true,
                node: true, // Node.js globals
                console: 'readonly',
                process: 'readonly',
            },
        },
        rules: {
            // General rules
            indent: ['error', 4],
            'max-len': ['error', { code: 320 }],
            'no-console': ['error', { allow: ['warn', 'error'] }],
            semi: ['error', 'never'],
        },
    },
]