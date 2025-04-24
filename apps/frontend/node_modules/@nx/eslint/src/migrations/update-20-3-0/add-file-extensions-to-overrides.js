"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ts = require("typescript");
const js_1 = require("@nx/js");
async function default_1(tree) {
    let rootConfig;
    // NOTE: we don't support generating ESM base config currently so they are not handled.
    for (const candidate of ['eslint.config.js', 'eslint.config.cjs']) {
        if (tree.exists(candidate)) {
            rootConfig = candidate;
            break;
        }
    }
    if (!rootConfig)
        return;
    updateOverrideFileExtensions(tree, rootConfig, 'plugin:@nx/typescript', [`'**/*.ts'`, `'**/*.tsx'`], [`'**/*.cts'`, `'**/*.mts'`]);
    updateOverrideFileExtensions(tree, rootConfig, 'plugin:@nx/javascript', [`'**/*.js'`, `'**/*.jsx'`], [`'**/*.cjs'`, `'**/*.mjs'`]);
}
function updateOverrideFileExtensions(tree, configFile, plugin, matchingExts, newExts) {
    const content = tree.read(configFile, 'utf-8');
    const source = ts.createSourceFile('', content, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    let compatNode;
    const spreadElementNodes = (0, js_1.findNodes)(source, ts.SyntaxKind.SpreadElement);
    for (const a of spreadElementNodes) {
        const assignmentNodes = (0, js_1.findNodes)(a, ts.SyntaxKind.PropertyAssignment);
        if (assignmentNodes.length === 0)
            continue;
        for (const b of assignmentNodes) {
            if (b.name.getText() === 'extends' &&
                b.initializer.getText().includes(plugin)) {
                compatNode = a;
                break;
            }
        }
    }
    if (compatNode) {
        const arrayNodes = (0, js_1.findNodes)(compatNode, ts.SyntaxKind.ArrayLiteralExpression);
        for (const a of arrayNodes) {
            if (matchingExts.every((ext) => a.elements.some((e) => e.getText() === ext))) {
                const exts = new Set(a.elements.map((e) => e.getText()));
                for (const ext of newExts) {
                    exts.add(ext);
                }
                (0, js_1.replaceChange)(tree, source, configFile, a.getStart(a.getSourceFile()), `[${Array.from(exts).join(', ')}]`, a.getText()).getText();
            }
        }
    }
}
