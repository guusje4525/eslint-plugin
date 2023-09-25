"use strict";
/**
 * Copied from https://github.com/jsx-eslint/eslint-plugin-react as this was needed for a custom check
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
const myRule = {
    defaultOptions: [],
    meta: {
        docs: {
            description: 'Disallow missing `key` props in iterators/collection literals',
            recommended: 'warn',
            url: 'https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-key.md',
        },
        type: 'suggestion',
        messages: {
            missingIterKey: 'Missing "key" prop for element in iterator',
            missingIterKeyUsePrag: 'Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead',
            missingArrayKey: 'Missing "key" prop for element in array',
            missingArrayKeyUsePrag: 'Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use {{reactPrag}}.{{fragPrag}} instead',
            keyBeforeSpread: '`key` prop must be placed before any `{...spread}, to avoid conflicting with React’s new JSX transform: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html`',
            nonUniqueKeys: '`key` prop must be unique',
        },
        schema: [{
                type: 'object',
                properties: {
                    checkFragmentShorthand: {
                        type: 'boolean',
                        default: false,
                    },
                    checkKeyMustBeforeSpread: {
                        type: 'boolean',
                        default: false,
                    },
                    warnOnDuplicates: {
                        type: 'boolean',
                        default: false,
                    },
                },
                additionalProperties: false,
            }],
    },
    create(context) {
        const options = Object.assign({}, context.options[0]);
        const checkFragmentShorthand = options.checkFragmentShorthand;
        const checkKeyMustBeforeSpread = options.checkKeyMustBeforeSpread;
        const reactPragma = utils_1.default.pragmaUtilgetFromContext(context);
        const fragmentPragma = 'Fragment';
        function checkIteratorElement(node) {
            if (node.type === 'JSXElement' && !utils_1.default.hasProp(node.openingElement.attributes, 'key')) {
                context.report({
                    node,
                    messageId: "missingIterKey",
                });
            }
            else if (checkFragmentShorthand && node.type === 'JSXFragment') {
                context.report({
                    node,
                    messageId: "missingIterKeyUsePrag",
                    data: {
                        reactPrag: reactPragma,
                        fragPrag: fragmentPragma,
                    }
                });
            }
        }
        function getReturnStatements(node, args) {
            const returnStatements = args || [];
            if (node.type === 'IfStatement') {
                if (node.consequent) {
                    getReturnStatements(node.consequent, returnStatements);
                }
                if (node.alternate) {
                    getReturnStatements(node.alternate, returnStatements);
                }
            }
            else if (Array.isArray(node.body)) {
                node.body.forEach((item) => {
                    if (item.type === 'IfStatement') {
                        getReturnStatements(item, returnStatements);
                    }
                    if (item.type === 'ReturnStatement') {
                        returnStatements.push(item);
                    }
                });
            }
            return returnStatements;
        }
        function isKeyAfterSpread(attributes) {
            let hasFoundSpread = false;
            return attributes.some((attribute) => {
                if (attribute.type === 'JSXSpreadAttribute') {
                    hasFoundSpread = true;
                    return false;
                }
                if (attribute.type !== 'JSXAttribute') {
                    return false;
                }
                return hasFoundSpread && utils_1.default.propName(attribute) === 'key';
            });
        }
        /**
         * Checks if the given node is a function expression or arrow function,
         * and checks if there is a missing key prop in return statement's arguments
         * @param {ASTNode} node
         */
        function checkFunctionsBlockStatement(node) {
            if (utils_1.default.functionLikeExpression(node)) {
                if (node.body.type === 'BlockStatement') {
                    getReturnStatements(node.body, [])
                        .filter((returnStatement) => returnStatement && returnStatement.argument)
                        .forEach((returnStatement) => {
                        checkIteratorElement(returnStatement.argument);
                    });
                }
            }
        }
        /**
         * Checks if the given node is an arrow function that has an JSX Element or JSX Fragment in its body,
         * and the JSX is missing a key prop
         * @param {ASTNode} node
         */
        function checkArrowFunctionWithJSX(node) {
            const isArrFn = node && node.type === 'ArrowFunctionExpression';
            const shouldCheckNode = (n) => n && (n.type === 'JSXElement' || n.type === 'JSXFragment');
            if (isArrFn && shouldCheckNode(node.body)) {
                checkIteratorElement(node.body);
            }
            if (node.body.type === 'ConditionalExpression') {
                if (shouldCheckNode(node.body.consequent)) {
                    checkIteratorElement(node.body.consequent);
                }
                if (shouldCheckNode(node.body.alternate)) {
                    checkIteratorElement(node.body.alternate);
                }
            }
            else if (node.body.type === 'LogicalExpression' && shouldCheckNode(node.body.right)) {
                checkIteratorElement(node.body.right);
            }
        }
        const childrenToArraySelector = `:matches(
      CallExpression
        [callee.object.object.name=${reactPragma}]
        [callee.object.property.name=Children]
        [callee.property.name=toArray],
      CallExpression
        [callee.object.name=Children]
        [callee.property.name=toArray]
    )`.replace(/\s/g, '');
        let isWithinChildrenToArray = false;
        return {
            [childrenToArraySelector]() {
                isWithinChildrenToArray = true;
            },
            [`${childrenToArraySelector}:exit`]() {
                isWithinChildrenToArray = false;
            },
            'ArrayExpression, JSXElement > JSXElement'(node) {
                if (isWithinChildrenToArray) {
                    return;
                }
                const jsx = (node.type === 'ArrayExpression' ? node.elements : node.parent.children).filter((x) => x && x.type === 'JSXElement');
                if (jsx.length === 0) {
                    return;
                }
                const map = {};
                jsx.forEach((element) => {
                    const attrs = element.openingElement.attributes;
                    const keys = attrs.filter((x) => x.name && x.name.name === 'key');
                    if (keys.length === 0) {
                        if (node.type === 'ArrayExpression') {
                            context.report({
                                node: element,
                                messageId: "missingArrayKey"
                            });
                        }
                    }
                    else {
                        keys.forEach((attr) => {
                            const value = context.getSourceCode().getText(attr.value);
                            if (!map[value]) {
                                map[value] = [];
                            }
                            map[value].push(attr);
                            if (checkKeyMustBeforeSpread && isKeyAfterSpread(attrs)) {
                                context.report({
                                    node: node.type === 'ArrayExpression' ? node : node.parent,
                                    messageId: "keyBeforeSpread"
                                });
                            }
                        });
                    }
                });
            },
            JSXFragment: node => {
                var _a;
                if (!checkFragmentShorthand || isWithinChildrenToArray) {
                    return;
                }
                if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.type) === 'ArrayExpression') {
                    context.report({
                        node,
                        messageId: "missingArrayKeyUsePrag",
                        data: {
                            reactPrag: reactPragma,
                            fragPrag: fragmentPragma,
                        }
                    });
                }
            },
            // Array.prototype.map
            // eslint-disable-next-line no-multi-str
            'CallExpression[callee.type="MemberExpression"][callee.property.name="map"],\
       CallExpression[callee.type="OptionalMemberExpression"][callee.property.name="map"],\
       OptionalCallExpression[callee.type="MemberExpression"][callee.property.name="map"],\
       OptionalCallExpression[callee.type="OptionalMemberExpression"][callee.property.name="map"]'(node) {
                if (isWithinChildrenToArray) {
                    return;
                }
                const fn = node.arguments.length > 0 && node.arguments[0];
                if (!fn || !utils_1.default.functionLikeExpression(fn)) {
                    return;
                }
                checkArrowFunctionWithJSX(fn);
                checkFunctionsBlockStatement(fn);
            },
            // Array.from
            'CallExpression[callee.type="MemberExpression"][callee.property.name="from"]'(node) {
                if (isWithinChildrenToArray) {
                    return;
                }
                const fn = node.arguments.length > 1 && node.arguments[1];
                if (!utils_1.default.functionLikeExpression(fn)) {
                    return;
                }
                checkArrowFunctionWithJSX(fn);
                checkFunctionsBlockStatement(fn);
            },
        };
    },
};
exports.default = myRule;
//# sourceMappingURL=index.js.map