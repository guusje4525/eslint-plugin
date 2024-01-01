import muiImportChecker from './mui-import-checker/index'
import noInlineFunctions from './no-inline-functions-in-jsx/index'
import JSXKey from './jsx-key'
import goMethodShouldHavePages from './electrodb-go-params'
import useCorrectStoreName from './correct-store-name'

export const rules = {
  'mui-import-checker': muiImportChecker,
  'no-inline-functions-in-jsx': noInlineFunctions,
  'jsx-key': JSXKey,
  'go-method-should-have-pages': goMethodShouldHavePages,
  'use-correct-store-name': useCorrectStoreName
}
