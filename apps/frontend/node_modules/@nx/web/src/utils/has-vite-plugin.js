"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasVitePlugin = hasVitePlugin;
const devkit_1 = require("@nx/devkit");
function hasVitePlugin(tree) {
    const nxJson = (0, devkit_1.readNxJson)(tree);
    return !!nxJson.plugins?.some((p) => typeof p === 'string'
        ? p === '@nx/vite/plugin'
        : p.plugin === '@nx/vite/plugin');
}
