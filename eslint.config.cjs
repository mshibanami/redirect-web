const globals = require('globals');
const eslintJs = require("@eslint/js");
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
    eslintJs.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es6,
                ...globals.commonjs
            }
        },
    },
    {
        files: [
            "*.ts",
            "**/*.ts",
            "*.tsx",
            "**/*.tsx",
        ],
        plugins: {
            "@typescript-eslint": typescriptPlugin
        },
        languageOptions: {
            sourceType: "module",
            parser: typescriptParser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: 2020
            }
        },
        rules: {
            "consistent-return": "warn",
            "no-undef": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/require-await": "warn",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                {
                    "assertionStyle": "as",
                    "objectLiteralTypeAssertions": "allow-as-parameter"
                }
            ],

            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": [
                "error",
                {
                    "ignoreDeclarationMerge": true,
                }
            ],

            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "args": "none",
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                },
            ],
        },
    },
]
