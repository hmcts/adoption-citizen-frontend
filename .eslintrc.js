module.exports = {
  "env": { "browser": true, "es6": true, "node": true },
  "extends": ["eslint:recommended"],
  "globals": { "Atomics": "readonly", "SharedArrayBuffer": "readonly" },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "quotes": ["error", "single"],
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    "eol-last": ["error"],
    "no-trailing-spaces": ["error"],
    "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0}],
    "no-console": ["error"],
    "object-curly-spacing": ["error", "always"]
  },
  "overrides": [
    {
      "files": ["**/*.ts", "**/*.tsx"],
      "env": { "browser": true, "es6": true, "node": true },
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      "globals": { "Atomics": "readonly", "SharedArrayBuffer": "readonly" },
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
        "project": "./tsconfig.json"
      },
      "plugins": ["@typescript-eslint"],
      "rules": {
        "indent": ["error", 2, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single", { "avoidEscape": true }],
        "comma-dangle": ["error", "always-multiline"],
        "@typescript-eslint/no-var-requires": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/camelcase": 0
      },
    }
  ]

};
