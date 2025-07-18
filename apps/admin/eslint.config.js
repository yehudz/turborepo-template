import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      ".next/**",
      "dist/**", 
      "node_modules/**",
      "postcss.config.js"
    ]
  },
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];