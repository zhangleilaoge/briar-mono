import ts from 'typescript';
import { ConvertedExpression } from '../../helper';
import { useEnum } from '../../type';
import { getNodeByKind } from '../../utils/ast';

export const injectConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  const arrNode = getNodeByKind(
    node,
    ts.SyntaxKind.ArrayLiteralExpression
  ) as ts.ArrayLiteralExpression;

  // case1: ['a', 'b']
  if (arrNode) {
    return arrNode.elements.map((el) => {
      const elName = el.getText(sourceFile).replace(/['"]+/g, '');
      return {
        use: useEnum.Inject,
        expression: `const ${elName} = inject('${elName}');`,
        returnNames: [elName],
      };
    });
  }

  const objNode = getNodeByKind(
    node,
    ts.SyntaxKind.ObjectLiteralExpression
  ) as ts.ObjectLiteralExpression;

  if (objNode) {
    return objNode.properties
      .map((injectItem) => {
        const _injectItem = injectItem as ts.PropertyAssignment;
        const injectName = _injectItem.name.getText(sourceFile);

        // case2: {a: 'a'}
        if (ts.isStringLiteral(_injectItem.initializer)) {
          const injectFrom = _injectItem.initializer.getText(sourceFile);

          return {
            use: useEnum.Inject,
            expression: `const ${injectName} = inject(${injectFrom});`,
            returnNames: [injectName],
          };
        }

        // case3: {a: {from: 'a', default: 'b'}}
        if (ts.isObjectLiteralExpression(_injectItem.initializer)) {
          let _from = '';
          let _default = '';
          for (const injectItemProp of _injectItem.initializer.properties) {
            if (injectItemProp.name?.getText(sourceFile) === 'from') {
              _from = (
                injectItemProp as ts.PropertyAssignment
              ).initializer.getText(sourceFile);
            }
            if (injectItemProp.name?.getText(sourceFile) === 'default') {
              _default = (
                injectItemProp as ts.PropertyAssignment
              ).initializer.getText(sourceFile);
            }
          }

          return {
            use: useEnum.Inject,
            expression: `const ${injectName} = inject(${_from})${
              _default ? ` || (${_default})` : ''
            };`,
            returnNames: [injectName],
          };
        }
        return null;
      })
      .filter(Boolean) as ConvertedExpression[];
  }

  return [];
};
