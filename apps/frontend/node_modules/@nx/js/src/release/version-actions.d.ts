import { ProjectGraph, Tree } from '@nx/devkit';
import { AfterAllProjectsVersioned, VersionActions } from 'nx/release';
import type { NxReleaseVersionV2Configuration } from 'nx/src/config/nx-json';
export declare const afterAllProjectsVersioned: AfterAllProjectsVersioned;
export default class JsVersionActions extends VersionActions {
    validManifestFilenames: string[];
    readCurrentVersionFromSourceManifest(tree: Tree): Promise<{
        currentVersion: string;
        manifestPath: string;
    }>;
    readCurrentVersionFromRegistry(tree: Tree, currentVersionResolverMetadata: NxReleaseVersionV2Configuration['currentVersionResolverMetadata']): Promise<{
        currentVersion: string;
        logText: string;
    }>;
    readCurrentVersionOfDependency(tree: Tree, projectGraph: ProjectGraph, dependencyProjectName: string): Promise<{
        currentVersion: string | null;
        dependencyCollection: string | null;
    }>;
    isLocalDependencyProtocol(versionSpecifier: string): Promise<boolean>;
    updateProjectVersion(tree: Tree, newVersion: string): Promise<string[]>;
    updateProjectDependencies(tree: Tree, projectGraph: ProjectGraph, dependenciesToUpdate: Record<string, string>): Promise<string[]>;
}
