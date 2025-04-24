"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRootEsLint = setupRootEsLint;
const devkit_1 = require("@nx/devkit");
const flat_config_1 = require("../../utils/flat-config");
const versions_1 = require("../../utils/versions");
const global_eslint_config_1 = require("../init/global-eslint-config");
const eslint_file_1 = require("../utils/eslint-file");
function setupRootEsLint(tree, options) {
    const rootEslintFile = (0, eslint_file_1.findEslintFile)(tree);
    if (rootEslintFile) {
        return () => { };
    }
    options.eslintConfigFormat ??= 'mjs';
    if (!(0, flat_config_1.useFlatConfig)(tree)) {
        return setUpLegacyRootEslintRc(tree, options);
    }
    return setUpRootFlatConfig(tree, options);
}
function setUpLegacyRootEslintRc(tree, options) {
    (0, devkit_1.writeJson)(tree, '.eslintrc.json', (0, global_eslint_config_1.getGlobalEsLintConfiguration)(options.unitTestRunner, options.rootProject));
    if (tree.exists('.eslintignore')) {
        let content = tree.read('.eslintignore', 'utf-8');
        if (!/^node_modules$/gm.test(content)) {
            content = `${content}\nnode_modules\n`;
            tree.write('.eslintignore', content);
        }
    }
    else {
        tree.write('.eslintignore', 'node_modules\n');
    }
    return !options.skipPackageJson
        ? (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
            '@nx/eslint-plugin': versions_1.nxVersion,
            '@typescript-eslint/parser': versions_1.typescriptESLintVersion,
            '@typescript-eslint/eslint-plugin': versions_1.typescriptESLintVersion,
            'eslint-config-prettier': versions_1.eslintConfigPrettierVersion,
        })
        : () => { };
}
function setUpRootFlatConfig(tree, options) {
    tree.write(`eslint.config.${options.eslintConfigFormat}`, (0, global_eslint_config_1.getGlobalFlatEslintConfiguration)(options.eslintConfigFormat, options.rootProject));
    return !options.skipPackageJson
        ? (0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
            '@eslint/js': versions_1.eslint9__eslintVersion,
            '@nx/eslint-plugin': versions_1.nxVersion,
            eslint: versions_1.eslint9__eslintVersion,
            'eslint-config-prettier': versions_1.eslintConfigPrettierVersion,
            'typescript-eslint': versions_1.eslint9__typescriptESLintVersion,
        })
        : () => { };
}
