import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import babelParser from "@babel/eslint-parser";

export default defineConfig(
  [globalIgnores(["dist", "node_modules"])],
  [
    {
      files: ["**/*.{js,mjs,cjs}"],
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.jest,
        },
        parser: babelParser,
      },
      plugins: { js },
      rules: {
        ...js.configs.recommended.rules,
      },
    },
    {
      files: ["babel.config.js", "webpack*"],
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },
  ],
);
