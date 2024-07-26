import ts from 'typescript';

/** @description 过滤掉未在 setup 中使用的 props */
export const filterUsedProps = (
  propNames: string[],
  sourceFile: ts.SourceFile
) => {
  const printer = ts.createPrinter();
  const content = printer.printFile(sourceFile);

  return propNames.filter((propName) => {
    const regex = new RegExp(`\\b${propName}\\b`, 'g');
    const matches = content.match(regex);

    return (matches?.length || 0) > 1;
  });
};

export const propReader = (
  node: ts.Node,
  sourceFile: ts.SourceFile
): string[] => {
  if (!ts.isPropertyAssignment(node)) return [];

  if (ts.isObjectLiteralExpression(node.initializer)) {
    return filterUsedProps(
      node.initializer.properties
        .map((prop) => {
          if (!ts.isPropertyAssignment(prop)) return null;
          return prop.name.getText(sourceFile);
        })
        .filter(Boolean) as string[],
      sourceFile
    );
  }
  if (ts.isArrayLiteralExpression(node.initializer)) {
    return filterUsedProps(
      node.initializer.elements
        .map((el) => {
          if (ts.isStringLiteral(el)) return el.text;
          return null;
        })
        .filter(Boolean) as string[],
      sourceFile
    );
  }
  return [];
};
