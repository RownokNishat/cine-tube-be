import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "src/generated/**", "**/*.ts", "**/*.tsx"],
  },
  {
    files: ["scripts/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-console": "off",
    },
  },
];
