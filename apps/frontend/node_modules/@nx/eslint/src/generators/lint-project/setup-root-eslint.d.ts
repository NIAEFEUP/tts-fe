import { type GeneratorCallback, type Tree } from '@nx/devkit';
export type SetupRootEsLintOptions = {
    unitTestRunner?: string;
    skipPackageJson?: boolean;
    rootProject?: boolean;
    eslintConfigFormat?: 'mjs' | 'cjs';
};
export declare function setupRootEsLint(tree: Tree, options: SetupRootEsLintOptions): GeneratorCallback;
