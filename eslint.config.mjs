// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore story files - they use @storybook/react directly
    "**/*.stories.tsx",
  ]),
  ...storybook.configs["flat/recommended"],
  // Relax unused vars rule - unused params with _ prefix are common
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "warn",
      // Disable overly strict setState-in-effect rule - it's too aggressive for common patterns
      "react-hooks/set-state-in-effect": "off",
    }
  }
]);

export default eslintConfig;
