"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveESLintClass = resolveESLintClass;
const flat_config_1 = require("../utils/flat-config");
async function resolveESLintClass(opts) {
    try {
        // Explicitly use the FlatESLint and LegacyESLint classes here because the ESLint class points at a different one based on ESLint v8 vs ESLint v9
        // But the decision on which one to use is not just based on the major version of ESLint.
        // @ts-expect-error The may be wrong based on our installed eslint version
        const { LegacyESLint, FlatESLint } = await Promise.resolve().then(() => require('eslint/use-at-your-own-risk'));
        const shouldESLintUseFlatConfig = typeof opts?.useFlatConfigOverrideVal === 'boolean'
            ? opts.useFlatConfigOverrideVal
            : (0, flat_config_1.useFlatConfig)();
        return shouldESLintUseFlatConfig ? FlatESLint : LegacyESLint;
    }
    catch {
        throw new Error('Unable to find `eslint`. Ensure a valid `eslint` version is installed.');
    }
}
