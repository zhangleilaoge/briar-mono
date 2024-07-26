import ts from 'typescript';
import { ConvertedExpression } from '../../helper';
import { useEnum } from '../../type';
import { getNodeByKind } from '../../utils/ast';

export const dataConverter = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): ConvertedExpression[] => {
  const objNode = getNodeByKind(node, ts.SyntaxKind.ObjectLiteralExpression);

  if (!(objNode && ts.isObjectLiteralExpression(objNode))) return [];

  return objNode.properties
    .map((prop) => {
      // 处理常量透传场景
      if (!ts.isPropertyAssignment(prop)) {
        return {
          expression: '',
          returnNames: [prop.name?.getText(sourceFile) || ''],
        };
      }

      const name = prop.name.getText(sourceFile);
      const text = prop.initializer.getText(sourceFile);
      return {
        use: useEnum.Ref,
        expression: `const ${name} = ref(${text})`,
        returnNames: [name],
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);
};
