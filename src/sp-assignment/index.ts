import { TSESLint } from '@typescript-eslint/utils'
import Utils from '../utils'

type MessageIds = 'statementsBeforeSpAssignment' | 'missingSpAssignment'

const myRule: TSESLint.RuleModule<MessageIds> = {
    defaultOptions: [],
    meta: {
        type: 'problem',
        docs: {
            description: "Ensure that in files containing 'store', constructors in classes have 'this.sp = sp' as the first line.",
            recommended: false
        },
        schema: [],
        messages: {
            statementsBeforeSpAssignment: 'Detected statements before the this.sp = sp assignment',
            missingSpAssignment: "The constructor should contain be 'this.sp = sp' if sp is given"
        }
    },
    create(context) {
        const fileName = context.getFilename()

        // Only process files that have "Store" in the name
        if (!fileName.includes("Store")) {
            return {}
        }

        return {
            MethodDefinition(node: any) {
                // Only check constructors
                if (node.kind !== "constructor") return

                const params = node.value.params

                // Ensure that the constructor has a paramater called sp
                if (!params || params.length === 0 || params[0].name !== 'sp') return

                // Go through each line, as we allow sp.something = '' and makeAutoObservable() statements before the initial this.sp = sp assignment

                for (const n of node?.value?.body?.body) {
                    // These are allowed to be before the this.sp = sp assignment
                    if (Utils.lineIsMakeAutoObserable(n) || Utils.lineMakesSpAssignment(n)) {
                        continue
                    }

                    // If we find the this.sp = sp line, then there is no point in continuing
                    if (Utils.lineIsThisSpIsSp(n)) {
                        return
                    }

                    // Detected an unexpected statement before we have set this.sp to sp
                    return context.report({
                        node: n,
                        messageId: "statementsBeforeSpAssignment",
                    })
                }

                // We didnt detect this.sp = sp, even though we did submit sp in the constructor
                context.report({
                    node: node.value,
                    messageId: "missingSpAssignment",
                })
            }
        }
    }
}

export default myRule
