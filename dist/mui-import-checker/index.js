"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myRule = {
    defaultOptions: [],
    meta: {
        fixable: "code",
        type: 'suggestion',
        messages: {
            avoidNoNamedMuiImport: `Avoid using named mui imports. Mui imports should look like this: import Box from "@mui/material/Box"`,
        },
        schema: [], // no options
    },
    create: context => ({
        ImportDeclaration: node => {
            if (node.source.value === "@mui/material" && node.specifiers.length > 0) {
                const fixes = node.specifiers.map((specifier) => {
                    if (specifier.type === "ImportSpecifier") {
                        const importedName = specifier.imported.name;
                        return `import ${importedName} from "@mui/material/${importedName}"`;
                    }
                    return null;
                }).filter(Boolean);
                if (fixes.length > 0) {
                    context.report({
                        node,
                        messageId: "avoidNoNamedMuiImport",
                        fix(fixer) {
                            return fixer.replaceText(node, fixes.join("\n"));
                        }
                    });
                }
            }
        }
    }),
};
exports.default = myRule;
//# sourceMappingURL=index.js.map