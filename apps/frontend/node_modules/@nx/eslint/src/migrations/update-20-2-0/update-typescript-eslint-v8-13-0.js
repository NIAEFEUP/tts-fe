"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const devkit_1 = require("@nx/devkit");
const semver_1 = require("semver");
const version_utils_1 = require("../../utils/version-utils");
async function default_1(tree) {
    const devDependencies = {};
    const checkPackageAndMigrate = (pkgName) => {
        const pkgVersion = (0, version_utils_1.getInstalledPackageVersion)(pkgName, tree);
        if (!!pkgVersion && (0, semver_1.gte)(pkgVersion, '8.0.0') && (0, semver_1.lt)(pkgVersion, '8.13.0')) {
            devDependencies[pkgName] = '^8.13.0';
        }
    };
    checkPackageAndMigrate('typescript-eslint');
    checkPackageAndMigrate('@typescript-eslint/eslint-plugin');
    checkPackageAndMigrate('@typescript-eslint/parser');
    checkPackageAndMigrate('@typescript-eslint/utils');
    if (Object.keys(devDependencies).length > 0) {
        return (0, devkit_1.addDependenciesToPackageJson)(tree, {}, devDependencies);
    }
    return () => { };
}
