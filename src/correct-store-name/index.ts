import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'useCorrectStoreName'

const myRule: TSESLint.RuleModule<MessageIds> = {
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
  create: (context: any) => ({
    Identifier: (node: any) => {
        // ex.
        // const store = useAuthStore()

        // Triggers when a const variable name is store
        if (node.name === 'store') {
            // Get the name of the value we are trying to assign to store
            const callee = node.parent.id.parent.init.callee.name
            // Is it starts with use (ex. useAuthStore starts with use)
            if (callee.startsWith('use')) {
                // Remove use
                const storeName = callee.split('use')[1]
                // First caracter should be lowercase
                const correctStoreName = storeName[0].toLowerCase() + storeName.substring(1);
                // Report and suggest a fix
                context.report({
                    node: node,
                    messageId: 'useCorrectStoreName',
                    data: {
                        correctStoreName,
                    },
                    suggest: [
                        {
                            desc: `Change to ${correctStoreName}`,
                            fix: function(fixer: any) {
                                return fixer.replaceText(node, correctStoreName)
                            }
                        },
                    ]
                });
            }
        }
      }
  }),
}

export default myRule
