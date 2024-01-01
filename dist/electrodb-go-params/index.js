"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myRule = {
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        messages: {
            goMethodShouldHavePages: "Please ensure that every .go() query from electroDB has atleast pages: 'all'. Also consider using limit if applicable",
        },
        schema: [],
    },
    create: context => ({
        MemberExpression: (node) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (((_a = node === null || node === void 0 ? void 0 : node.property) === null || _a === void 0 ? void 0 : _a.name) == 'go') {
                const firstParent = (_d = (_c = (_b = node.property) === null || _b === void 0 ? void 0 : _b.parent.object) === null || _c === void 0 ? void 0 : _c.callee) === null || _d === void 0 ? void 0 : _d.object;
                if ((firstParent === null || firstParent === void 0 ? void 0 : firstParent.type) === 'MemberExpression' || ((_f = (_e = firstParent === null || firstParent === void 0 ? void 0 : firstParent.callee) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.type) === 'MemberExpression') {
                    const query = ((_g = firstParent === null || firstParent === void 0 ? void 0 : firstParent.property) === null || _g === void 0 ? void 0 : _g.name) || ((_k = (_j = (_h = firstParent === null || firstParent === void 0 ? void 0 : firstParent.callee) === null || _h === void 0 ? void 0 : _h.object) === null || _j === void 0 ? void 0 : _j.property) === null || _k === void 0 ? void 0 : _k.name);
                    if (query === 'query') {
                        const hasPagesAndLimit = (((_l = node.parent.arguments[0]) === null || _l === void 0 ? void 0 : _l.properties) || []).some((x) => x.key.name === 'pages');
                        if (!hasPagesAndLimit) {
                            context.report({
                                node,
                                messageId: "goMethodShouldHavePages",
                            });
                        }
                    }
                }
            }
        }
    }),
};
exports.default = myRule;
//# sourceMappingURL=index.js.map