/**
 * Some functions copied from https://github.com/jsx-eslint/jsx-ast-utils as this was needed for a custom check
 * @fileoverview AST utility module for statically analyzing JSX
 * @author Ethan Cohen
 */
import { TSESLint, TSESTree } from "@typescript-eslint/utils";
export default class Utils {
    static JSX_ANNOTATION_REGEX: RegExp;
    static JS_IDENTIFIER_REGEX: RegExp;
    static propName(prop?: any): any;
    /**
     * Returns boolean indicating whether an prop exists on the props
     * property of a JSX element node.
     */
    static hasProp(props?: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[], prop?: string, options?: {
        spreadStrict: boolean;
        ignoreCase: boolean;
    }): boolean;
    /**
     * @param {Context} context
     * @returns {string}
     */
    static pragmaUtilgetFromContext(context: Readonly<TSESLint.RuleContext<string, []>>): string;
    static functionLikeExpression(node: any): boolean;
}
//# sourceMappingURL=index.d.ts.map