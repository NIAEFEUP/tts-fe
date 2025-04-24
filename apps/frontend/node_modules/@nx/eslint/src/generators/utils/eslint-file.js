"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEslintFile = findEslintFile;
exports.isEslintConfigSupported = isEslintConfigSupported;
exports.updateRelativePathsInConfig = updateRelativePathsInConfig;
exports.determineEslintConfigFormat = determineEslintConfigFormat;
exports.addOverrideToLintConfig = addOverrideToLintConfig;
exports.updateOverrideInLintConfig = updateOverrideInLintConfig;
exports.lintConfigHasOverride = lintConfigHasOverride;
exports.replaceOverridesInLintConfig = replaceOverridesInLintConfig;
exports.addExtendsToLintConfig = addExtendsToLintConfig;
exports.addPredefinedConfigToFlatLintConfig = addPredefinedConfigToFlatLintConfig;
exports.addPluginsToLintConfig = addPluginsToLintConfig;
exports.addIgnoresToLintConfig = addIgnoresToLintConfig;
exports.getPluginImport = getPluginImport;
const devkit_1 = require("@nx/devkit");
const semver_1 = require("semver");
const config_file_1 = require("../../utils/config-file");
const flat_config_1 = require("../../utils/flat-config");
const version_utils_1 = require("../../utils/version-utils");
const versions_1 = require("../../utils/versions");
const ast_utils_1 = require("./flat-config/ast-utils");
const path_utils_1 = require("./flat-config/path-utils");
const ts = require("typescript");
const posix_1 = require("node:path/posix");
function findEslintFile(tree, projectRoot) {
    if (projectRoot === undefined) {
        for (const file of [
            config_file_1.baseEsLintConfigFile,
            ...config_file_1.BASE_ESLINT_CONFIG_FILENAMES,
        ]) {
            if (tree.exists(file)) {
                return file;
            }
        }
    }
    projectRoot ??= '';
    for (const file of config_file_1.ESLINT_CONFIG_FILENAMES) {
        if (tree.exists((0, devkit_1.joinPathFragments)(projectRoot, file))) {
            return file;
        }
    }
    return null;
}
function isEslintConfigSupported(tree, projectRoot = '') {
    const eslintFile = findEslintFile(tree, projectRoot);
    if (!eslintFile) {
        return false;
    }
    return (eslintFile.endsWith('.json') ||
        eslintFile.endsWith('.config.js') ||
        eslintFile.endsWith('.config.cjs') ||
        eslintFile.endsWith('.config.mjs'));
}
function updateRelativePathsInConfig(tree, sourcePath, destinationPath) {
    if (sourcePath === destinationPath ||
        !isEslintConfigSupported(tree, destinationPath)) {
        return;
    }
    const configPath = (0, devkit_1.joinPathFragments)(destinationPath, findEslintFile(tree, destinationPath));
    const offset = (0, devkit_1.offsetFromRoot)(destinationPath);
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        const config = tree.read(configPath, 'utf-8');
        tree.write(configPath, replaceFlatConfigPaths(config, sourcePath, offset, destinationPath, tree));
    }
    else {
        (0, devkit_1.updateJson)(tree, configPath, (json) => {
            if (typeof json.extends === 'string') {
                json.extends = offsetFilePath(sourcePath, json.extends, offset, tree);
            }
            else if (json.extends) {
                json.extends = json.extends.map((extend) => offsetFilePath(sourcePath, extend, offset, tree));
            }
            json.overrides?.forEach((o) => {
                if (o.parserOptions?.project) {
                    o.parserOptions.project = Array.isArray(o.parserOptions.project)
                        ? o.parserOptions.project.map((p) => p.replace(sourcePath, destinationPath))
                        : o.parserOptions.project.replace(sourcePath, destinationPath);
                }
            });
            return json;
        });
    }
}
function replaceFlatConfigPaths(config, sourceRoot, offset, destinationRoot, tree) {
    let match;
    let newConfig = config;
    // replace requires
    const requireRegex = RegExp(/require\(['"](.*)['"]\)/g);
    while ((match = requireRegex.exec(newConfig)) !== null) {
        const newPath = offsetFilePath(sourceRoot, match[1], offset, tree);
        newConfig =
            newConfig.slice(0, match.index) +
                `require('${newPath}')` +
                newConfig.slice(match.index + match[0].length);
    }
    // Handle import statements
    const importRegex = RegExp(/import\s+.*?\s+from\s+['"](.*)['"]/g);
    while ((match = importRegex.exec(newConfig)) !== null) {
        const oldPath = match[1];
        const newPath = offsetFilePath(sourceRoot, oldPath, offset, tree);
        // Replace the old path with the updated path
        newConfig =
            newConfig.slice(0, match.index + match[0].indexOf(oldPath)) +
                newPath +
                newConfig.slice(match.index + match[0].indexOf(oldPath) + oldPath.length);
    }
    // replace projects
    const projectRegex = RegExp(/project:\s?\[?['"](.*)['"]\]?/g);
    while ((match = projectRegex.exec(newConfig)) !== null) {
        const newProjectDef = match[0].replaceAll(sourceRoot, destinationRoot);
        newConfig =
            newConfig.slice(0, match.index) +
                newProjectDef +
                newConfig.slice(match.index + match[0].length);
    }
    return newConfig;
}
function offsetFilePath(projectRoot, pathToFile, offset, tree) {
    if (config_file_1.ESLINT_CONFIG_FILENAMES.some((eslintFile) => pathToFile.includes(eslintFile))) {
        // if the file is point to base eslint
        const rootEslint = findEslintFile(tree);
        if (rootEslint) {
            return (0, devkit_1.joinPathFragments)(offset, rootEslint);
        }
    }
    if (!pathToFile.startsWith('..')) {
        // not a relative path
        return pathToFile;
    }
    return (0, devkit_1.joinPathFragments)(offset, projectRoot, pathToFile);
}
function determineEslintConfigFormat(content) {
    const sourceFile = ts.createSourceFile('', content, ts.ScriptTarget.Latest, true);
    // Check if there's an `export default` in the AST
    const hasExportDefault = sourceFile.statements.some((statement) => ts.isExportAssignment(statement) && !statement.isExportEquals);
    return hasExportDefault ? 'mjs' : 'cjs';
}
function addOverrideToLintConfig(tree, root, override, options = {
    insertAtTheEnd: true,
}) {
    const isBase = options.checkBaseConfig && findEslintFile(tree, root).includes('.base');
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        let fileName;
        if (isBase) {
            for (const file of config_file_1.BASE_ESLINT_CONFIG_FILENAMES) {
                if (tree.exists((0, devkit_1.joinPathFragments)(root, file))) {
                    fileName = (0, devkit_1.joinPathFragments)(root, file);
                    break;
                }
            }
        }
        else {
            for (const f of flat_config_1.eslintFlatConfigFilenames) {
                if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                    fileName = (0, devkit_1.joinPathFragments)(root, f);
                    break;
                }
            }
        }
        let content = tree.read(fileName, 'utf8');
        const format = content.includes('export default') ? 'mjs' : 'cjs';
        const flatOverride = (0, ast_utils_1.generateFlatOverride)(override, format);
        // Check if the provided override using legacy eslintrc properties or plugins, if so we need to add compat
        if ((0, ast_utils_1.overrideNeedsCompat)(override)) {
            content = (0, ast_utils_1.addFlatCompatToFlatConfig)(content);
        }
        tree.write(fileName, (0, ast_utils_1.addBlockToFlatConfigExport)(content, flatOverride, options));
    }
    else {
        const fileName = (0, devkit_1.joinPathFragments)(root, isBase ? config_file_1.baseEsLintConfigFile : '.eslintrc.json');
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            json.overrides ??= [];
            if (options.insertAtTheEnd) {
                json.overrides.push(override);
            }
            else {
                json.overrides.unshift(override);
            }
            return json;
        });
    }
}
function updateOverrideInLintConfig(tree, rootOrFile, lookup, update) {
    let fileName;
    let root = rootOrFile;
    if (tree.exists(rootOrFile) && tree.isFile(rootOrFile)) {
        fileName = rootOrFile;
        root = (0, posix_1.dirname)(rootOrFile);
    }
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        if (!fileName) {
            for (const f of flat_config_1.eslintFlatConfigFilenames) {
                if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                    fileName = (0, devkit_1.joinPathFragments)(root, f);
                    break;
                }
            }
        }
        let content = tree.read(fileName, 'utf8');
        content = (0, ast_utils_1.replaceOverride)(content, root, lookup, update);
        tree.write(fileName, content);
    }
    else {
        fileName ??= (0, devkit_1.joinPathFragments)(root, '.eslintrc.json');
        if (!tree.exists(fileName)) {
            return;
        }
        const existingJson = (0, devkit_1.readJson)(tree, fileName);
        if (!existingJson.overrides || !existingJson.overrides.some(lookup)) {
            return;
        }
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            const index = json.overrides.findIndex(lookup);
            if (index !== -1) {
                const newOverride = update(json.overrides[index]);
                if (newOverride) {
                    json.overrides[index] = newOverride;
                }
                else {
                    json.overrides.splice(index, 1);
                }
            }
            return json;
        });
    }
}
function lintConfigHasOverride(tree, rootOrFile, lookup, checkBaseConfig = false) {
    let fileName;
    let root = rootOrFile;
    if (tree.exists(rootOrFile) && tree.isFile(rootOrFile)) {
        fileName = rootOrFile;
        root = (0, posix_1.dirname)(rootOrFile);
    }
    if (!fileName && !isEslintConfigSupported(tree, root)) {
        return false;
    }
    const isBase = !fileName &&
        checkBaseConfig &&
        findEslintFile(tree, root).includes('.base');
    if (isBase) {
        for (const file of config_file_1.BASE_ESLINT_CONFIG_FILENAMES) {
            if (tree.exists((0, devkit_1.joinPathFragments)(root, file))) {
                fileName = (0, devkit_1.joinPathFragments)(root, file);
                break;
            }
        }
    }
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        if (!fileName) {
            for (const f of flat_config_1.eslintFlatConfigFilenames) {
                if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                    fileName = (0, devkit_1.joinPathFragments)(root, f);
                    break;
                }
            }
        }
        const content = tree.read(fileName, 'utf8');
        return (0, ast_utils_1.hasOverride)(content, lookup);
    }
    else {
        fileName ??= (0, devkit_1.joinPathFragments)(root, isBase ? config_file_1.baseEsLintConfigFile : '.eslintrc.json');
        return (0, devkit_1.readJson)(tree, fileName).overrides?.some(lookup) || false;
    }
}
function replaceOverridesInLintConfig(tree, root, overrides) {
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        let fileName;
        for (const f of flat_config_1.eslintFlatConfigFilenames) {
            if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                fileName = (0, devkit_1.joinPathFragments)(root, f);
                break;
            }
        }
        let content = tree.read(fileName, 'utf8');
        const format = content.includes('export default') ? 'mjs' : 'cjs';
        // Check if any of the provided overrides using legacy eslintrc properties or plugins, if so we need to add compat
        if (overrides.some(ast_utils_1.overrideNeedsCompat)) {
            content = (0, ast_utils_1.addFlatCompatToFlatConfig)(content);
        }
        content = (0, ast_utils_1.removeOverridesFromLintConfig)(content);
        overrides.forEach((override) => {
            const flatOverride = (0, ast_utils_1.generateFlatOverride)(override, format);
            content = (0, ast_utils_1.addBlockToFlatConfigExport)(content, flatOverride);
        });
        tree.write(fileName, content);
    }
    else {
        const fileName = (0, devkit_1.joinPathFragments)(root, '.eslintrc.json');
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            json.overrides = overrides;
            return json;
        });
    }
}
function addExtendsToLintConfig(tree, root, plugin, insertAtTheEnd = false) {
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        const pluginExtends = [];
        let fileName;
        for (const f of flat_config_1.eslintFlatConfigFilenames) {
            if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                fileName = (0, devkit_1.joinPathFragments)(root, f);
                break;
            }
        }
        // Check the file extension to determine the format of the config if it is .js we look for the export
        const eslintConfigFormat = fileName.endsWith('.mjs')
            ? 'mjs'
            : fileName.endsWith('.cjs')
                ? 'cjs'
                : tree.read(fileName, 'utf-8').includes('module.exports')
                    ? 'cjs'
                    : 'mjs';
        let shouldImportEslintCompat = false;
        // assume eslint version is 9 if not found, as it's what we'd be generating by default
        const eslintVersion = (0, version_utils_1.getInstalledEslintVersion)(tree) ?? versions_1.eslint9__eslintVersion;
        if ((0, semver_1.gte)(eslintVersion, '9.0.0')) {
            // eslint v9 requires the incompatible plugins to be wrapped with a helper from @eslint/compat
            const plugins = (Array.isArray(plugin) ? plugin : [plugin]).map((p) => typeof p === 'string' ? { name: p, needCompatFixup: false } : p);
            let compatiblePluginsBatch = [];
            plugins.forEach(({ name, needCompatFixup }) => {
                if (needCompatFixup) {
                    if (compatiblePluginsBatch.length > 0) {
                        // flush the current batch of compatible plugins and reset it
                        pluginExtends.push((0, ast_utils_1.generatePluginExtendsElement)(compatiblePluginsBatch));
                        compatiblePluginsBatch = [];
                    }
                    // generate the extends for the incompatible plugin
                    pluginExtends.push((0, ast_utils_1.generatePluginExtendsElementWithCompatFixup)(name));
                    shouldImportEslintCompat = true;
                }
                else {
                    // add the compatible plugin to the current batch
                    compatiblePluginsBatch.push(name);
                }
            });
            if (compatiblePluginsBatch.length > 0) {
                // flush the batch of compatible plugins
                pluginExtends.push((0, ast_utils_1.generatePluginExtendsElement)(compatiblePluginsBatch));
            }
        }
        else {
            const plugins = (Array.isArray(plugin) ? plugin : [plugin]).map((p) => typeof p === 'string' ? p : p.name);
            pluginExtends.push((0, ast_utils_1.generatePluginExtendsElement)(plugins));
        }
        let content = tree.read(fileName, 'utf8');
        if (shouldImportEslintCompat) {
            content = (0, ast_utils_1.addImportToFlatConfig)(content, ['fixupConfigRules'], '@eslint/compat');
        }
        content = (0, ast_utils_1.addFlatCompatToFlatConfig)(content);
        // reverse the order to ensure they are added in the correct order at the
        // start of the `extends` array
        for (const pluginExtend of pluginExtends.reverse()) {
            content = (0, ast_utils_1.addBlockToFlatConfigExport)(content, pluginExtend, {
                insertAtTheEnd,
            });
        }
        tree.write(fileName, content);
        if (shouldImportEslintCompat) {
            return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, { '@eslint/compat': versions_1.eslintCompat, '@eslint/eslintrc': versions_1.eslintrcVersion }, undefined, true);
        }
        return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, { '@eslint/eslintrc': versions_1.eslintrcVersion }, undefined, true);
    }
    else {
        const plugins = (Array.isArray(plugin) ? plugin : [plugin]).map((p) => typeof p === 'string' ? p : p.name);
        const fileName = (0, devkit_1.joinPathFragments)(root, '.eslintrc.json');
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            json.extends ??= [];
            json.extends = [
                ...plugins,
                ...(Array.isArray(json.extends) ? json.extends : [json.extends]),
            ];
            return json;
        });
        return () => { };
    }
}
function addPredefinedConfigToFlatLintConfig(tree, root, predefinedConfigName, moduleName = 'nx', moduleImportPath = '@nx/eslint-plugin', spread = true, insertAtTheEnd = true) {
    if (!(0, flat_config_1.useFlatConfig)(tree))
        throw new Error('Predefined configs can only be used with flat configs');
    let fileName;
    for (const f of flat_config_1.eslintFlatConfigFilenames) {
        if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
            fileName = (0, devkit_1.joinPathFragments)(root, f);
            break;
        }
    }
    let content = tree.read(fileName, 'utf8');
    content = (0, ast_utils_1.addImportToFlatConfig)(content, moduleName, moduleImportPath);
    content = (0, ast_utils_1.addBlockToFlatConfigExport)(content, (0, ast_utils_1.generateFlatPredefinedConfig)(predefinedConfigName, moduleName, spread), { insertAtTheEnd });
    tree.write(fileName, content);
}
function addPluginsToLintConfig(tree, root, plugin) {
    const plugins = Array.isArray(plugin) ? plugin : [plugin];
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        let fileName;
        for (const f of flat_config_1.eslintFlatConfigFilenames) {
            if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                fileName = (0, devkit_1.joinPathFragments)(root, f);
                break;
            }
        }
        let content = tree.read(fileName, 'utf8');
        const mappedPlugins = [];
        plugins.forEach((name) => {
            const imp = getPluginImport(name);
            const varName = (0, devkit_1.names)(imp).propertyName;
            mappedPlugins.push({ name, varName, imp });
        });
        mappedPlugins.forEach(({ varName, imp }) => {
            content = (0, ast_utils_1.addImportToFlatConfig)(content, varName, imp);
        });
        content = (0, ast_utils_1.addPluginsToExportsBlock)(content, mappedPlugins);
        tree.write(fileName, content);
    }
    else {
        const fileName = (0, devkit_1.joinPathFragments)(root, '.eslintrc.json');
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            json.plugins = [...plugins, ...(json.plugins ?? [])];
            return json;
        });
    }
}
function addIgnoresToLintConfig(tree, root, ignorePatterns) {
    if ((0, flat_config_1.useFlatConfig)(tree)) {
        let fileName;
        for (const f of flat_config_1.eslintFlatConfigFilenames) {
            if (tree.exists((0, devkit_1.joinPathFragments)(root, f))) {
                fileName = (0, devkit_1.joinPathFragments)(root, f);
                break;
            }
        }
        if (!fileName) {
            return;
        }
        let content = tree.read(fileName, 'utf8');
        if ((0, ast_utils_1.hasFlatConfigIgnoresBlock)(content)) {
            content = (0, ast_utils_1.addPatternsToFlatConfigIgnoresBlock)(content, ignorePatterns);
            tree.write(fileName, content);
        }
        else {
            const block = (0, ast_utils_1.generateAst)({
                ignores: ignorePatterns.map((path) => (0, path_utils_1.mapFilePath)(path)),
            });
            tree.write(fileName, (0, ast_utils_1.addBlockToFlatConfigExport)(content, block));
        }
    }
    else {
        const fileName = (0, devkit_1.joinPathFragments)(root, '.eslintrc.json');
        if (!tree.exists(fileName)) {
            return;
        }
        (0, devkit_1.updateJson)(tree, fileName, (json) => {
            const ignoreSet = new Set([
                ...(json.ignorePatterns ?? []),
                ...ignorePatterns,
            ]);
            json.ignorePatterns = Array.from(ignoreSet);
            return json;
        });
    }
}
function getPluginImport(pluginName) {
    if (pluginName.includes('eslint-plugin-')) {
        return pluginName;
    }
    if (!pluginName.startsWith('@')) {
        return `eslint-plugin-${pluginName}`;
    }
    if (!pluginName.includes('/')) {
        return `${pluginName}/eslint-plugin`;
    }
    const [scope, name] = pluginName.split('/');
    return `${scope}/eslint-plugin-${name}`;
}
