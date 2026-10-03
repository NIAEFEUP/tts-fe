import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: ["dist/", "node_modules/", "src/infrastructure/database/contract.d.ts"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // Domain layer: may only import core/.
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/application/**", "@/infrastructure/**", "@/interface/**"],
              message: "Domain layer can only import from core/.",
            },
          ],
        },
      ],
    },
  },
  // Application layer: may only import domain/ and core/.
  {
    files: ["src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/infrastructure/**", "@/interface/**"],
              message: "Application layer can only import from domain/ and core/.",
            },
          ],
        },
      ],
    },
  },
  // Infrastructure layer: may only import domain/ports/ and core/.
  {
    files: ["src/infrastructure/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/application/**", "@/interface/**", "@/domain/entities/**", "@/domain/value-objects/**"],
              message: "Infrastructure layer can only import from domain/ports/ and core/.",
            },
          ],
        },
      ],
    },
  },
  // Interface layer: may import application/, domain/, and core/; never infrastructure/.
  {
    files: ["src/interface/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/infrastructure/**"],
              message: "Interface layer must not import infrastructure/ directly (use dependency injection).",
            },
          ],
        },
      ],
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-console": ["error", { allow: ["error", "warn", "debug", "log"] }],
    },
  },
];
