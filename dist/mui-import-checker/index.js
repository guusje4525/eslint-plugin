"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myRule = {
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
                });
            }
        },
    }),
};
exports.default = myRule;
//# sourceMappingURL=index.js.map