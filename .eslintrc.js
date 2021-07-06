module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        'prettier'
    ],
    "rules": {
        'prettier/prettier': [
          1,
          {
            trailingComma: 'es5',
            singleQuote: true,
            semi: true,
          },
        ],
        ...require('eslint-config-prettier').rules,
        ...require('eslint-config-prettier/@typescript-eslint').rules,
      },
};
