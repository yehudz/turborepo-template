import reactPlugin from "eslint-plugin-react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["node_modules/**", "dist/**", ".expo/**", "*.config.js"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-unused-vars": ["error", { 
        "varsIgnorePattern": "^React$",
        "argsIgnorePattern": "^_"
      }],
      "no-console": "warn",
      "prefer-const": "warn",
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];