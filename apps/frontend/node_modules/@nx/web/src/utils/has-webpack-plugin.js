"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasWebpackPlugin = hasWebpackPlugin;
const devkit_1 = require("@nx/devkit");
function hasWebpackPlugin(tree) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    return !!nxJson.plugins?.some((p) => typeof p === 'string'
        ? p === '@nx/webpack/plugin'
        : p.plugin === '@nx/webpack/plugin');
}
