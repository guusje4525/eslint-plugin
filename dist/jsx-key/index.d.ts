/**
 * Copied from https://github.com/jsx-eslint/eslint-plugin-react as this was needed for a custom check
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */
import { TSESLint } from '@typescript-eslint/utils';
type MessageIds = 'missingIterKey' | 'missingIterKeyUsePrag' | 'missingArrayKey' | 'missingArrayKeyUsePrag' | 'keyBeforeSpread' | 'nonUniqueKeys';
declare const myRule: TSESLint.RuleModule<MessageIds>;
export default myRule;
//# sourceMappingURL=index.d.ts.map