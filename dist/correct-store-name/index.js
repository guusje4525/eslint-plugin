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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            // ex.
            // const store = useAuthStore()
            // Triggers when a const variable name is store
            if (node.name === 'store' && ((_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.parent) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.init) === null || _d === void 0 ? void 0 : _d.callee)) {
                // Get the name of the value we are trying to assign to store
                const callee = (_j = (_h = (_g = (_f = (_e = node === null || node === void 0 ? void 0 : node.parent) === null || _e === void 0 ? void 0 : _e.id) === null || _f === void 0 ? void 0 : _f.parent) === null || _g === void 0 ? void 0 : _g.init) === null || _h === void 0 ? void 0 : _h.callee) === null || _j === void 0 ? void 0 : _j.name;
                let newStoreName = '';
                // If we are initializing a new store
                if (callee && typeof callee === 'string') {
                    if (callee === 'useStore') {
                        newStoreName = (_t = (_s = (_r = (_q = (_p = (_o = (_m = (_l = (_k = node === null || node === void 0 ? void 0 : node.parent) === null || _k === void 0 ? void 0 : _k.id) === null || _l === void 0 ? void 0 : _l.parent) === null || _m === void 0 ? void 0 : _m.init) === null || _o === void 0 ? void 0 : _o.callee) === null || _p === void 0 ? void 0 : _p.parent) === null || _q === void 0 ? void 0 : _q.arguments[0]) === null || _r === void 0 ? void 0 : _r.body) === null || _s === void 0 ? void 0 : _s.callee) === null || _t === void 0 ? void 0 : _t.name;
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