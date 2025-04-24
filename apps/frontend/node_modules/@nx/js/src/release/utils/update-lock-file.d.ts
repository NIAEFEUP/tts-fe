export declare function updateLockFile(cwd: string, { dryRun, verbose, useLegacyVersioning, options, }: {
    dryRun?: boolean;
    verbose?: boolean;
    useLegacyVersioning?: boolean;
    options?: {
        skipLockFileUpdate?: boolean;
        installArgs?: string;
        installIgnoreScripts?: boolean;
    };
}): Promise<string[]>;
