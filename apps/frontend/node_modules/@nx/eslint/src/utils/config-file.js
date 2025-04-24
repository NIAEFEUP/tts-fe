"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyBaseEsLintFlatConfigFile = exports.baseEsLintFlatConfigFile = exports.baseEsLintConfigFile = exports.BASE_ESLINT_CONFIG_FILENAMES = exports.ESLINT_CONFIG_FILENAMES = exports.ESLINT_OLD_CONFIG_FILENAMES = exports.ESLINT_FLAT_CONFIG_FILENAMES = void 0;
exports.isFlatConfig = isFlatConfig;
exports.findFlatConfigFile = findFlatConfigFile;
exports.findOldConfigFile = findOldConfigFile;
const fs_1 = require("fs");
const path_1 = require("path");
const flat_config_1 = require("./flat-config");
exports.ESLINT_FLAT_CONFIG_FILENAMES = flat_config_1.eslintFlatConfigFilenames;
exports.ESLINT_OLD_CONFIG_FILENAMES = [
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
];
exports.ESLINT_CONFIG_FILENAMES = [
    ...exports.ESLINT_OLD_CONFIG_FILENAMES,
    ...exports.ESLINT_FLAT_CONFIG_FILENAMES,
];
exports.BASE_ESLINT_CONFIG_FILENAMES = flat_config_1.baseEslintConfigFilenames;
exports.baseEsLintConfigFile = '.eslintrc.base.json';
exports.baseEsLintFlatConfigFile = 'eslint.base.config.mjs';
// Make sure we can handle previous file extension as well for migrations or custom generators.
exports.legacyBaseEsLintFlatConfigFile = 'eslint.base.config.js';
function isFlatConfig(configFilePath) {
    const configFileName = (0, path_1.basename)(configFilePath);
    return exports.ESLINT_FLAT_CONFIG_FILENAMES.includes(configFileName);
}
// https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-resolution
function findFlatConfigFile(directory, workspaceRoot) {
    let currentDir = (0, path_1.resolve)(workspaceRoot, directory);
    while (true) {
        const configFilePath = getConfigFileInDirectory(currentDir, exports.ESLINT_FLAT_CONFIG_FILENAMES);
        if (configFilePath) {
            return configFilePath;
        }
        if (currentDir === workspaceRoot) {
            break;
        }
        currentDir = (0, path_1.dirname)(currentDir);
    }
    return null;
}
function findOldConfigFile(filePathOrDirectory, workspaceRoot) {
    let currentDir = (0, path_1.resolve)(workspaceRoot, filePathOrDirectory);
    if (!(0, fs_1.statSync)(currentDir).isDirectory()) {
        currentDir = (0, path_1.dirname)(currentDir);
    }
    while (true) {
        const configFilePath = getConfigFileInDirectory(currentDir, exports.ESLINT_OLD_CONFIG_FILENAMES);
        if (configFilePath) {
            return configFilePath;
        }
        if (currentDir === workspaceRoot) {
            break;
        }
        currentDir = (0, path_1.dirname)(currentDir);
    }
    return null;
}
function getConfigFileInDirectory(directory, candidateFileNames) {
    for (const filename of candidateFileNames) {
        const filePath = (0, path_1.join)(directory, filename);
        if ((0, fs_1.existsSync)(filePath)) {
            return filePath;
        }
    }
    return null;
}
