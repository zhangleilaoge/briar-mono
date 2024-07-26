import ts from 'typescript';
import { IVuexParams } from '../type';
import { DEFAULT_VUEX_PARAMS } from '../constants';
import { getNodeBy } from './ast';

export const handleVuex = (sourceFile: ts.SourceFile): IVuexParams => {
  let moduleName = '';
  const bindingNames: Record<string, string> = {
    ...DEFAULT_VUEX_PARAMS,
  };

  getNodeBy(sourceFile, (node: ts.Node) => {
    if (ts.isVariableDeclaration(node)) {
      const callExpression = node.initializer!;
      if (
        ts.isObjectBindingPattern(node.name) &&
        ts.isCallExpression(callExpression)
      ) {
        if (
          ts.isIdentifier(callExpression.expression) &&
          callExpression.expression.getText(sourceFile) ===
            'createNamespacedHelpers'
        ) {
          moduleName = callExpression.arguments[0].getText(sourceFile);
          node.name.elements.forEach((element) => {
            bindingNames[
              (element.propertyName || element.name).getText(sourceFile)
            ] = (element.name as ts.Identifier).getText(sourceFile);
          });
          return true;
        }
      }
    }
    return false;
  });

  return {
    ...DEFAULT_VUEX_PARAMS,
    ...bindingNames,
    moduleName,
  };
};
