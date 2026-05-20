// Flat ESLint config for Next.js 16 + Prettier integration.
// `next lint` was removed in Next 16; this file is consumed by `eslint .`.
// `eslint-config-prettier/flat` MUST be the last rule-bearing entry so it can
// disable the formatting rules that conflict with Prettier.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
