"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initEsLint = initEsLint;
exports.lintInitGenerator = lintInitGenerator;
const devkit_1 = require("@nx/devkit");
const add_plugin_1 = require("@nx/devkit/src/utils/add-plugin");
const versions_1 = require("../../utils/versions");
const eslint_file_1 = require("../utils/eslint-file");
const plugin_1 = require("../../plugins/plugin");
const plugin_2 = require("../utils/plugin");
const path_1 = require("path");
function updateProductionFileset(tree, format = 'mjs') {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const productionFileSet = nxJson.namedInputs?.production;
    if (productionFileSet) {
        productionFileSet.push('!{projectRoot}/.eslintrc.json');
        productionFileSet.push(`!{projectRoot}/eslint.config.${format}`);
        // Dedupe and set
        nxJson.namedInputs.production = Array.from(new Set(productionFileSet));
    }
    (0, devkit_1.updateNxJson)(tree, nxJson);
}
function addTargetDefaults(tree, format) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    nxJson.targetDefaults ??= {};
    nxJson.targetDefaults['@nx/eslint:lint'] ??= {};
    nxJson.targetDefaults['@nx/eslint:lint'].cache ??= true;
    nxJson.targetDefaults['@nx/eslint:lint'].inputs ??= [
        'default',
        `{workspaceRoot}/.eslintrc.json`,
        `{workspaceRoot}/.eslintignore`,
        `{workspaceRoot}/eslint.config.${format}`,
    ];
    (0, devkit_1.updateNxJson)(tree, nxJson);
}
function updateVsCodeRecommendedExtensions(host) {
    if (!host.exists('.vscode/extensions.json')) {
        return;
    }
    (0, devkit_1.updateJson)(host, '.vscode/extensions.json', (json) => {
        json.recommendations = json.recommendations || [];
        const extension = 'dbaeumer.vscode-eslint';
        if (!json.recommendations.includes(extension)) {
            json.recommendations.push(extension);
        }
        return json;
    });
}
async function initEsLint(tree, options) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    const addPluginDefault = process.env.NX_ADD_PLUGINS !== 'false' &&
        nxJson.useInferencePlugins !== false;
    options.addPlugin ??= addPluginDefault;
    options.eslintConfigFormat ??= 'mjs';
    const hasPlugin = (0, plugin_2.hasEslintPlugin)(tree);
    const rootEslintFile = (0, eslint_file_1.findEslintFile)(tree);
    if (rootEslintFile) {
        const fileExtension = (0, path_1.extname)(rootEslintFile);
        if (fileExtension === '.mjs' || fileExtension === '.cjs') {
            options.eslintConfigFormat = fileExtension.slice(1);
        }
        else {
            options.eslintConfigFormat = (0, eslint_file_1.determineEslintConfigFormat)(tree.read(rootEslintFile, 'utf-8'));
        }
    }
    const graph = await (0, devkit_1.createProjectGraphAsync)();
    const lintTargetNames = [
        'lint',
        'eslint:lint',
        'eslint-lint',
        '_lint',
        '_eslint:lint',
        '_eslint-lint',
    ];
    if (rootEslintFile && options.addPlugin && !hasPlugin) {
        await (0, add_plugin_1.addPlugin)(tree, graph, '@nx/eslint/plugin', plugin_1.createNodesV2, {
            targetName: lintTargetNames,
        }, options.updatePackageScripts);
        return () => { };
    }
    if (rootEslintFile) {
        return () => { };
    }
    updateProductionFileset(tree, options.eslintConfigFormat);
    updateVsCodeRecommendedExtensions(tree);
    if (options.addPlugin) {
        await (0, add_plugin_1.addPlugin)(tree, graph, '@nx/eslint/plugin', plugin_1.createNodesV2, {
            targetName: lintTargetNames,
        }, options.updatePackageScripts);
    }
    else {
        addTargetDefaults(tree, options.eslintConfigFormat);
    }
    const tasks = [];
    if (!options.skipPackageJson) {
        tasks.push((0, devkit_1.removeDependenciesFromPackageJson)(tree, ['@nx/eslint'], []));
        tasks.push((0, devkit_1.addDependenciesToPackageJson)(tree, {}, {
            '@nx/eslint': versions_1.nxVersion,
            eslint: versions_1.eslintVersion,
        }, undefined, options.keepExistingVersions));
    }
    return (0, devkit_1.runTasksInSerial)(...tasks);
}
async function lintInitGenerator(tree, options) {
    return await initEsLint(tree, { addPlugin: false, ...options });
}
