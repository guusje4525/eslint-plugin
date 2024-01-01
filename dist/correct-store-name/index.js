"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myRule = {
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        messages: {
            useCorrectStoreName: "Don't use store, use {{ correctStoreName }} instead",
        },
        docs: {
            description: "Properly named stores are a lot easier to identify & work with",
            recommended: 'warn',
        },
        fixable: 'code',
        hasSuggestions: true,
        schema: [],
    },
    create: (context) => ({
        Identifier: (node) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            // ex.
            // const store = useAuthStore()
            // Triggers when a const variable name is store
            if (node.name === 'store' && 'parent' in node && 'id' in node.parent && 'parent' in node.parent.id && 'init' in node.parent.id.parent && 'callee' in node.parent.id.parent.init) {
                // Get the name of the value we are trying to assign to store
                const callee = (_e = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.init) === null || _d === void 0 ? void 0 : _d.callee) === null || _e === void 0 ? void 0 : _e.name;
                let newStoreName = '';
                // If we are initializing a new store
                if (callee && typeof callee === 'string') {
                    if (callee === 'useStore') {
                        newStoreName = (_p = (_o = (_m = (_l = (_k = (_j = (_h = (_g = (_f = node === null || node === void 0 ? void 0 : node.parent) === null || _f === void 0 ? void 0 : _f.id) === null || _g === void 0 ? void 0 : _g.parent) === null || _h === void 0 ? void 0 : _h.init) === null || _j === void 0 ? void 0 : _j.callee) === null || _k === void 0 ? void 0 : _k.parent) === null || _l === void 0 ? void 0 : _l.arguments[0]) === null || _m === void 0 ? void 0 : _m.body) === null || _o === void 0 ? void 0 : _o.callee) === null || _p === void 0 ? void 0 : _p.name;
                        // Is it starts with use (ex. useAuthStore starts with use)
                    }
                    else if (callee.startsWith('use')) {
                        // Remove use
                        newStoreName = callee.split('use')[1];
                    }
                    if (newStoreName && newStoreName !== '') {
                        // First caracter should be lowercase
                        newStoreName = newStoreName[0].toLowerCase() + newStoreName.substring(1);
                        // Report and suggest a fix
                        context.report({
                            node: node,
                            messageId: 'useCorrectStoreName',
                            data: {
                                correctStoreName: newStoreName,
                            },
                            suggest: [
                                {
                                    desc: `Change to ${newStoreName}`,
                                    fix: function (fixer) {
                                        return fixer.replaceText(node, newStoreName);
                                    }
                                },
                            ]
                        });
                    }
                }
            }
        }
    }),
};
exports.default = myRule;
//# sourceMappingURL=index.js.map