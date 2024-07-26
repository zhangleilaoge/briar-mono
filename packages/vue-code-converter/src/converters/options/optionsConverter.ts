import ts from 'typescript';
import { ConvertedExpression, lifecycleNameMap } from '../../helper';
import { computedConverter } from './computedConverter';
import { dataConverter } from './dataConverter';
import { lifecycleConverter } from './lifecycleConverter';
import { methodsConverter } from './methodsConverter';
import { watchConverter } from './watchConverter';
import { propReader } from './propsReader';
import { IVuexParams, Vue2LifecycleEnum, useEnum } from '../../type';
import { injectConverter } from './injectConverter';
import { getFunctionStatements, getNodeByKind } from '../../utils/ast';
import { providerConverter } from './provideConverter';
import { DEFAULT_VUEX_PARAMS } from '../../constants';

const _convertOptions = ({
  exportObject,
  sourceFile,
  vuexParams = DEFAULT_VUEX_PARAMS,
}: {
  exportObject: ts.ObjectLiteralExpression;
  sourceFile: ts.SourceFile;
  vuexParams?: IVuexParams;
}) => {
  const otherProps: ts.ObjectLiteralElementLike[] = [];
  const functionStatements: ConvertedExpression[] = [];
  const dataProps: ConvertedExpression[] = [];
  const computedProps: ConvertedExpression[] = [];
  const methodsProps: ConvertedExpression[] = [];
  const watchProps: ConvertedExpression[] = [];
  const lifecycleProps: ConvertedExpression[] = [];
  const propNames: string[] = [];
  const injectProps: ConvertedExpression[] = [];
  const provideProps: ConvertedExpression[] = [];

  exportObject.properties.forEach((prop) => {
    const name = prop.name?.getText(sourceFile) || '';
    switch (true) {
      case name === 'data':
        dataProps.push(...dataConverter(prop, sourceFile));
        functionStatements.push(...getFunctionStatements(prop, sourceFile));
        break;
      case name === 'computed':
        computedProps.push(
          ...computedConverter({ node: prop, sourceFile, vuexParams })
        );
        break;
      case name === 'watch':
        watchProps.push(...watchConverter(prop, sourceFile));
        break;
      case name === 'methods':
        methodsProps.push(
          ...methodsConverter({ node: prop, sourceFile, vuexParams })
        );
        break;
      case lifecycleNameMap.has(name as Vue2LifecycleEnum):
        lifecycleProps.push(...lifecycleConverter(prop, sourceFile));
        break;
      case name === 'inject':
        injectProps.push(...injectConverter(prop, sourceFile));
        break;
      case name === 'provide':
        provideProps.push(...providerConverter(prop, sourceFile));
        functionStatements.push(...getFunctionStatements(prop, sourceFile));
        break;
      default:
        if (name === 'props') {
          propNames.push(...propReader(prop, sourceFile));
        }

        otherProps.push(prop);
        break;
    }
  });

  const propsRefProps: ConvertedExpression[] =
    propNames.length === 0
      ? []
      : [
          {
            use: useEnum.ToRefs,
            expression: `const { ${propNames.join(',')} } = toRefs(props)`,
            returnNames: propNames,
          },
        ];

  const setupProps: ConvertedExpression[] = [
    ...functionStatements,
    ...propsRefProps,
    ...injectProps,
    ...dataProps,
    ...computedProps,
    ...methodsProps,
    ...watchProps,
    ...lifecycleProps,
    ...provideProps,
  ];

  return {
    setupProps,
    propNames,
    otherProps,
  };
};

export const convertOptions = (
  sourceFile: ts.SourceFile,
  vuexParams: IVuexParams = DEFAULT_VUEX_PARAMS
) => {
  const exportAssignNode = getNodeByKind(
    sourceFile,
    ts.SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    const objectNode = getNodeByKind(
      exportAssignNode,
      ts.SyntaxKind.ObjectLiteralExpression
    );
    if (objectNode && ts.isObjectLiteralExpression(objectNode)) {
      return _convertOptions({
        exportObject: objectNode,
        sourceFile,
        vuexParams,
      });
    }
  }
  const classNode = getNodeByKind(sourceFile, ts.SyntaxKind.ClassDeclaration);
  if (classNode) {
    const decoratorNode = getNodeByKind(classNode, ts.SyntaxKind.Decorator);

    if (decoratorNode) {
      const objectNode = getNodeByKind(
        decoratorNode,
        ts.SyntaxKind.ObjectLiteralExpression
      );

      if (objectNode && ts.isObjectLiteralExpression(objectNode)) {
        return _convertOptions({
          exportObject: objectNode,
          sourceFile,
          vuexParams,
        });
      }
    }
  }

  return null;
};
