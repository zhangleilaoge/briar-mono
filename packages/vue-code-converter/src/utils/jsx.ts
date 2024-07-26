import ts from 'typescript';
import { unicodeToChinese } from './unicode';
import { SFCBlock } from 'vue-template-compiler';

export function wrapWithTag(
  code: string,
  tagName: string,
  attrs: Record<string, any> = {}
): string {
  const printer = ts.createPrinter();

  const jsxOpeningElement = ts.createJsxOpeningElement(
    ts.factory.createIdentifier(tagName),
    [],
    ts.factory.createJsxAttributes([
      ...Object.entries(attrs).map(([key, value]) => {
        return ts.factory.createJsxAttribute(
          ts.factory.createIdentifier(key),
          value && value !== 'true' && value !== true
            ? ts.createLiteral(value)
            : undefined
        );
      }),
    ])
  );
  const openingElementText = printer.printNode(
    ts.EmitHint.Unspecified,
    jsxOpeningElement,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest)
  );

  const jsxClosingElement = ts.factory.createJsxClosingElement(
    ts.factory.createIdentifier(tagName)
  );

  const closingElementText = printer.printNode(
    ts.EmitHint.Unspecified,
    jsxClosingElement,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest)
  );

  return openingElementText + code + closingElementText;
}

export function getCompleteContent(
  template?: SFCBlock,
  script?: SFCBlock,
  style?: SFCBlock
): string {
  const templateStr = template?.content
    ? wrapWithTag(template?.content, 'template', {
        ...template?.attrs,
      })
    : '';
  const scriptStr = script?.content
    ? wrapWithTag(unicodeToChinese(script?.content), 'script', {
        ...script?.attrs,
        lang: 'ts',
      })
    : '';
  const styleStr = style?.content
    ? wrapWithTag(style?.content, 'style', { ...style?.attrs, lang: 'scss' })
    : '';
  return `${templateStr}${scriptStr}${styleStr}`;
}
