/**
 * Copied from https://github.com/jsx-eslint/eslint-plugin-react as this was needed for a custom check
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

import { TSESLint } from '@typescript-eslint/utils'
import Utils from '../utils'

type MessageIds = 'missingIterKey' | 'missingIterKeyUsePrag' | 'missingArrayKey' | 'missingArrayKeyUsePrag' | 'keyBeforeSpread' | 'nonUniqueKeys'

const myRule: TSESLint.RuleModule<MessageIds> = {
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
    create(context: any) {
        const options = Object.assign({}, context.options[0])
        const checkFragmentShorthand = options.checkFragmentShorthand
        const checkKeyMustBeforeSpread = options.checkKeyMustBeforeSpread
        const reactPragma = Utils.pragmaUtilgetFromContext(context)
        const fragmentPragma = 'Fragment'

        function checkIteratorElement(node: any) {
            if (node.type === 'JSXElement' && !Utils.hasProp(node.openingElement.attributes, 'key')) {
                context.report({
                    node,
                    messageId: "missingIterKey",
                })
            } else if (checkFragmentShorthand && node.type === 'JSXFragment') {
                context.report({
                    node,
                    messageId: "missingIterKeyUsePrag",
                    data: {
                        reactPrag: reactPragma,
                        fragPrag: fragmentPragma,
                    }
                })
            }
        }

        function getReturnStatements(node: any, args: any) {
            const returnStatements = args || []
            if (node.type === 'IfStatement') {
                if (node.consequent) {
                    getReturnStatements(node.consequent, returnStatements)
                }
                if (node.alternate) {
                    getReturnStatements(node.alternate, returnStatements)
                }
            } else if (Array.isArray(node.body)) {
                node.body.forEach((item: any) => {
                    if (item.type === 'IfStatement') {
                        getReturnStatements(item, returnStatements)
                    }

                    if (item.type === 'ReturnStatement') {
                        returnStatements.push(item)
                    }
                })
            }

            return returnStatements
        }

        function isKeyAfterSpread(attributes: any) {
            let hasFoundSpread = false
            return attributes.some((attribute: any) => {
                if (attribute.type === 'JSXSpreadAttribute') {
                    hasFoundSpread = true
                    return false
                }
                if (attribute.type !== 'JSXAttribute') {
                    return false
                }
                return hasFoundSpread && Utils.propName(attribute) === 'key'
            })
        }

        /**
         * Checks if the given node is a function expression or arrow function,
         * and checks if there is a missing key prop in return statement's arguments
         * @param {ASTNode} node
         */
        function checkFunctionsBlockStatement(node: any) {
            if (Utils.functionLikeExpression(node)) {
                if (node.body.type === 'BlockStatement') {
                    getReturnStatements(node.body, [])
                        .filter((returnStatement: any) => returnStatement && returnStatement.argument)
                        .forEach((returnStatement: any) => {
                            checkIteratorElement(returnStatement.argument)
                        })
                }
            }
        }

        /**
         * Checks if the given node is an arrow function that has an JSX Element or JSX Fragment in its body,
         * and the JSX is missing a key prop
         * @param {ASTNode} node
         */
        function checkArrowFunctionWithJSX(node: any) {
            const isArrFn = node && node.type === 'ArrowFunctionExpression'
            const shouldCheckNode = (n: any) => n && (n.type === 'JSXElement' || n.type === 'JSXFragment')
            if (isArrFn && shouldCheckNode(node.body)) {
                checkIteratorElement(node.body)
            }
            if (node.body.type === 'ConditionalExpression') {
                if (shouldCheckNode(node.body.consequent)) {
                    checkIteratorElement(node.body.consequent)
                }
                if (shouldCheckNode(node.body.alternate)) {
                    checkIteratorElement(node.body.alternate)
                }
            } else if (node.body.type === 'LogicalExpression' && shouldCheckNode(node.body.right)) {
                checkIteratorElement(node.body.right)
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
    )`.replace(/\s/g, '')
        let isWithinChildrenToArray = false

        return {
            [childrenToArraySelector]() {
                isWithinChildrenToArray = true
            },

            [`${childrenToArraySelector}:exit`]() {
                isWithinChildrenToArray = false
            },

            'ArrayExpression, JSXElement > JSXElement'(node: any) {
                if (isWithinChildrenToArray) {
                    return
                }

                const jsx = (node.type === 'ArrayExpression' ? node.elements : node.parent.children).filter((x: any) => x && x.type === 'JSXElement')
                if (jsx.length === 0) {
                    return
                }

                const map: any = {}
                jsx.forEach((element: any) => {
                    const attrs = element.openingElement.attributes
                    const keys = attrs.filter((x: any) => x.name && x.name.name === 'key')

                    if (keys.length === 0) {
                        if (node.type === 'ArrayExpression') {
                            context.report({
                                node: element,
                                messageId: "missingArrayKey"
                            })
                        }
                    } else {
                        keys.forEach((attr: any) => {
                            const value = context.getSourceCode().getText(attr.value)
                            if (!map[value]) { map[value] = [] }
                            map[value].push(attr)

                            if (checkKeyMustBeforeSpread && isKeyAfterSpread(attrs)) {
                                context.report({
                                    node: node.type === 'ArrayExpression' ? node : node.parent,
                                    messageId: "keyBeforeSpread"
                                })
                            }
                        })
                    }
                })
            },

            JSXFragment: node => {
                if (!checkFragmentShorthand || isWithinChildrenToArray) {
                    return
                }

                if (node.parent?.type === 'ArrayExpression') {
                    context.report({
                        node,
                        messageId: "missingArrayKeyUsePrag",
                        data: {
                            reactPrag: reactPragma,
                            fragPrag: fragmentPragma,
                        }
                    })
                }
            },

            // Array.prototype.map
            // eslint-disable-next-line no-multi-str
            'CallExpression[callee.type="MemberExpression"][callee.property.name="map"],\
       CallExpression[callee.type="OptionalMemberExpression"][callee.property.name="map"],\
       OptionalCallExpression[callee.type="MemberExpression"][callee.property.name="map"],\
       OptionalCallExpression[callee.type="OptionalMemberExpression"][callee.property.name="map"]'(node: any) {
                if (isWithinChildrenToArray) {
                    return
                }

                const fn = node.arguments.length > 0 && node.arguments[0]
                if (!fn || !Utils.functionLikeExpression(fn)) {
                    return
                }

                checkArrowFunctionWithJSX(fn)

                checkFunctionsBlockStatement(fn)
            },

            // Array.from
            'CallExpression[callee.type="MemberExpression"][callee.property.name="from"]'(node: any) {
                if (isWithinChildrenToArray) {
                    return
                }

                const fn = node.arguments.length > 1 && node.arguments[1]
                if (!Utils.functionLikeExpression(fn)) {
                    return
                }

                checkArrowFunctionWithJSX(fn)

                checkFunctionsBlockStatement(fn)
            },
        }
    },
}

export default myRule
