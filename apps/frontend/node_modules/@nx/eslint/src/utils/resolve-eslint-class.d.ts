import type { ESLint } from 'eslint';
export declare function resolveESLintClass(opts?: {
    useFlatConfigOverrideVal: boolean;
}): Promise<typeof ESLint>;
