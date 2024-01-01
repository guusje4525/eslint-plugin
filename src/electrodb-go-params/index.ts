import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'goMethodShouldHavePages'

const myRule: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    messages: {
        goMethodShouldHavePages: "Please ensure that every .go() query from electroDB has atleast pages: 'all'. Also consider using limit if applicable",
    },
    schema: [],
  },
  create: context => ({
    MemberExpression: (node: any) => {
        if (node?.property?.name == 'go') {
            const firstParent = node.property?.parent.object?.callee?.object
    
            if (firstParent?.type === 'MemberExpression' || firstParent?.callee?.object?.type === 'MemberExpression') {
                const query = firstParent?.property?.name || firstParent?.callee?.object?.property?.name
                if (query === 'query') {
                    const hasPagesAndLimit = (node.parent.arguments[0]?.properties || []).some((x: any) => x.key.name === 'pages')
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
}

export default myRule
