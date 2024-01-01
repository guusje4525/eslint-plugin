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
            let newStoreName: any = ''
            // If we are initializing a new store
            if (callee === 'useStore') {
                newStoreName = node?.parent?.id?.parent?.init?.callee?.parent?.arguments[0]?.body?.callee?.name
            // Is it starts with use (ex. useAuthStore starts with use)
            } else if (callee.startsWith('use')) {
                // Remove use
                newStoreName = callee.split('use')[1]
            }
            
            if (newStoreName && newStoreName !== '') {   
                // First caracter should be lowercase
                newStoreName = newStoreName[0].toLowerCase() + newStoreName.substring(1)

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
                            fix: function (fixer: any) {
                                return fixer.replaceText(node, newStoreName);
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
