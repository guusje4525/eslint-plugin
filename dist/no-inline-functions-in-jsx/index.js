"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myRule = {
    defaultOptions: [],
    meta: {
        type: 'suggestion',
        messages: {
            noJSX: 'No inline functions. Please move the function {{ jsxName }} in {{ jsxElement }} to a store'
        },
        docs: {
            description: "Since functions are objects in JavaScript ({} !== {}), the inline function will always fail the prop diff when React does a diff check. Also, an arrow function will create a new instance of the function on each render if it's used in a JSX property. This might create a lot of work for the garbage collector.",
            recommended: 'warn',
            url: 'https://stackoverflow.com/questions/36677733/why-shouldnt-jsx-props-use-arrow-functions-or-bind#answer-36677798'
        },
        schema: [], // no options
    },
    create: context => ({
        ArrowFunctionExpression: node => {
            var _a, _b, _c, _d;
            if (((_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.type) === 'JSXAttribute') {
                const element = node.parent.parent;
                const jsxName = element.name.name;
                // parent does have the name property
                const jsxElement = (_d = (_c = element.parent) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.name;
                context.report({
                    node,
                    messageId: "noJSX",
                    data: {
                        jsxName,
                        jsxElement
                    },
                });
            }
        }
    }),
};
exports.default = myRule;
//# sourceMappingURL=index.js.map