import ts from 'typescript';
import { ConvertedExpression } from '../../helper';
import { useEnum } from '../../type';
import { getNodeByKind } from '../../utils/ast';

export const providerConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  const objNode = getNodeByKind(
    node,
    ts.SyntaxKind.ObjectLiteralExpression
  ) as ts.ObjectLiteralExpression;

  if (objNode) {
    return objNode.properties.map((prop) => {
      const _prop = prop as ts.PropertyAssignment;
      const provideName = _prop.name.getText(sourceFile);
      return {
        use: useEnum.Provide,
        expression: `provide('${provideName}', ${_prop.initializer.getText(
          sourceFile
        )})`,
      };
    });
  }

  return [];
};
