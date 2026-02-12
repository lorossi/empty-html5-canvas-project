import { jsdoc } from "eslint-plugin-jsdoc";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "js/deps/*.js", // Ignore dependencies
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
    rules: {
      "jsdoc/check-types": "error", // Checks that types are valid JSDoc types
      "jsdoc/no-undefined-types": "error", // Fails on unknown typedefs
      "jsdoc/require-param-type": "error", // Requires type for @param
      "jsdoc/require-returns-type": "error", // Requires type for @returns
    },
  }),
]);
