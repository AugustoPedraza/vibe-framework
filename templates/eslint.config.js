// ESLint Configuration Template — Tailwind CSS Plugin Integration
// Add this to your existing eslint.config.js to enforce design token usage.
//
// Install: npm install -D eslint-plugin-tailwindcss@^4.0.0
//
// This catches violations that hooks can't:
// - Arbitrary values (w-[300px], p-[15px])
// - Contradicting classnames (w-full w-1/2)
// - Invalid/non-existent Tailwind classes
// - Class ordering consistency

import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";
import a11y from "eslint-plugin-jsx-a11y";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],

  // Tailwind CSS enforcement
  ...tailwind.configs["flat/recommended"],
  {
    rules: {
      // Block arbitrary values — forces use of design token scale
      "tailwindcss/no-arbitrary-value": "error",

      // Catch contradicting classes (e.g., w-full w-1/2)
      "tailwindcss/no-contradicting-classname": "error",

      // Consistent class ordering
      "tailwindcss/classnames-order": "warn",

      // Catch non-existent classes (typos, removed utilities)
      "tailwindcss/no-custom-classname": ["warn", {
        // Allow project-specific custom classes
        whitelist: [
          "z-base", "z-raised", "z-dropdown", "z-sticky",
          "z-overlay", "z-modal", "z-popover", "z-toast", "z-tooltip",
        ],
      }],
    },
  },

  // Svelte-specific overrides
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      // Warn on inline styles — catches hardcoded values bypassing design tokens.
      // Set to "warn" (not "error") because style: directives are the correct
      // Svelte 5 pattern for data-driven values (progress bars, drag positions,
      // charts, themes via CSS custom properties). Use eslint-disable-next-line
      // with a justification comment for legitimate dynamic uses.
      "svelte/no-inline-styles": ["warn", { allowTransitions: true }],
    },
  },

  // Ignore build output
  {
    ignores: ["_build/", "deps/", "node_modules/", "priv/static/"],
  },
);
