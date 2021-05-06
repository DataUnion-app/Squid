module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier-vue/recommended",
    // Do not add `'prettier/vue'` if you don't want to use prettier for `<template>` blocks
    "prettier/vue",
  ],

  settings: {
    "prettier-vue": {
      // Settings for how to process Vue SFC Blocks
      SFCBlocks: {
        template: false,
        script: false,
        style: false,
      },

      // Use prettierrc for prettier options or not (default: `true`)
      usePrettierrc: true,

      // Set the options for `prettier.getFileInfo`.
      // @see https://prettier.io/docs/en/api.html#prettiergetfileinfofilepath-options
      fileInfoOptions: {
        // Path to ignore file (default: `'.prettierignore'`)
        // Notice that the ignore file is only used for this plugin
        ignorePath: ".testignore",

        // Process the files in `node_modules` or not (default: `false`)
        withNodeModules: false,
      },
    },
  },

  parserOptions: {
    sourceType: "module",
  },
  rules: {
    // 'comma-dangle': ['error', 'always-multiline'],
    indent: ["error", 2, { SwitchCase: 1 }],
    "linebreak-style": ["error", "unix"],
    quotes: ["off", "double"], // Easier for Go developers!
    semi: ["error", "always"],
    "no-unused-vars": ["warn"],
    "no-console": 0,
    "no-case-declarations": 0,
    "no-prototype-builtins": 0,
    "prettier-vue/prettier": [
      "error",
      {
        // Override all options of `prettier` here
        // @see https://prettier.io/docs/en/options.html
        printWidth: 100,
        singleQuote: false,
        semi: true,
        trailingComma: "es5",
        htmlWhitespaceSensitivity: "strict",
      },
    ],
  },
};
