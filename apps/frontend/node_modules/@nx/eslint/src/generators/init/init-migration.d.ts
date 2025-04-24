import { GeneratorCallback, ProjectConfiguration, TargetConfiguration, Tree } from '@nx/devkit';
export declare function migrateConfigToMonorepoStyle(projects: ProjectConfiguration[], tree: Tree, unitTestRunner: string, eslintConfigFormat: 'mjs' | 'cjs', keepExistingVersions?: boolean): GeneratorCallback;
export declare function findLintTarget(project: ProjectConfiguration): TargetConfiguration;
