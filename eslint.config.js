import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["src/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    languageOptions:
    {
      globals: { ...globals.browser, ...globals.node }
    },
  },
  {
    settings: {
      react: {
        version: '18.2',
      },
    },
  },
  {
    ignores: ["src/components/ui/*", "src/components/svgs/*", "build/"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': ['error', { allow: ["error", "warn", "debug"] }]
    }
  },
];
