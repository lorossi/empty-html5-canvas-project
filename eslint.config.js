import { jsdoc } from "eslint-plugin-jsdoc";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "js/jszip.js",
    "js/simplex-noise.js",
    "js/lib.js",
    "js/xor128.js",
  ]),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        UIEvent: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
      },
    },
    files: ["**/*.js"],
  },
  jsdoc({
    config: "flat/recommended",
  }),
]);
