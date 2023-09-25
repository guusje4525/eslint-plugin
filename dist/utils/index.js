"use strict";
/**
 * Some functions copied from https://github.com/jsx-eslint/jsx-ast-utils as this was needed for a custom check
 * @fileoverview AST utility module for statically analyzing JSX
 * @author Ethan Cohen
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static propName(prop = {}) {
        if (!prop.type || prop.type !== 'JSXAttribute') {
            throw new Error('The prop must be a JSXAttribute collected by the AST parser.');
        }
        if (prop.name.type === 'JSXNamespacedName') {
            return `${prop.name.namespace.name}:${prop.name.name.name}`;
        }
        return prop.name.name;
    }
    /**
     * Returns boolean indicating whether an prop exists on the props
     * property of a JSX element node.
     */
    static hasProp(props = [], prop = '', options = { spreadStrict: true, ignoreCase: true }) {
        const propToCheck = options.ignoreCase ? prop.toUpperCase() : prop;
        return props.some(attribute => {
            // If the props contain a spread prop, then refer to strict param.
            if (attribute.type === 'JSXSpreadAttribute') {
                return !options.spreadStrict;
            }
            const currentProp = options.ignoreCase
                ? Utils.propName(attribute).toUpperCase()
                : Utils.propName(attribute);
            return propToCheck === currentProp;
        });
    }
    /**
     * @param {Context} context
     * @returns {string}
     */
    static pragmaUtilgetFromContext(context) {
        let pragma = 'React';
        const sourceCode = context.getSourceCode();
        const pragmaNode = sourceCode.getAllComments().find((node) => Utils.JSX_ANNOTATION_REGEX.test(node.value));
        if (pragmaNode) {
            const matches = Utils.JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
            if (matches && matches[1]) {
                pragma = matches[1].split('.')[0];
            }
            else
                [
                    pragma = null
                ];
        }
        if (!Utils.JS_IDENTIFIER_REGEX.test(pragma)) {
            throw new Error(`React pragma ${pragma} is not a valid identifier`);
        }
        return pragma;
    }
    static functionLikeExpression(node) {
        return node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
    }
}
Utils.JSX_ANNOTATION_REGEX = /@jsx\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
Utils.JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;
exports.default = Utils;
//# sourceMappingURL=index.js.map