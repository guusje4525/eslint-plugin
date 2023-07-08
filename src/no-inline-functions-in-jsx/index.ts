import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'noJSX'

const myRule: TSESLint.RuleModule<MessageIds> = {
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
        if (node.parent?.parent?.type === 'JSXAttribute') {
            const element = node.parent.parent
            const jsxName = element.name.name
            // parent does have the name property
            const jsxElement = (element as any).parent?.name?.name

            context.report({
                node,
                messageId: "noJSX",
                data: {
                    jsxName,
                    jsxElement
                },
            })
        }
    }
  }),
}

export default myRule
