import { TSESLint } from '@typescript-eslint/utils'

type MessageIds = 'avoidNoNamedMuiImport'

const myRule: TSESLint.RuleModule<MessageIds> = {
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    messages: {
        avoidNoNamedMuiImport: `Avoid using named mui imports. Mui imports should look like this: import Box from "@mui/material/Box"`,
    },
    schema: [], // no options
  },
  create: context => ({
    ImportDeclaration: node => {
        if (node.source.value === "@mui/material" || node.source.value === '@mui/icons-material') {
            context.report({
                node,
                messageId: "avoidNoNamedMuiImport",
            })
        }
    },
  }),
}

export default myRule
