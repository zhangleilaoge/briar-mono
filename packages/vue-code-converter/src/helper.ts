import ts from 'typescript';
import { IVuexParams, Vue2LifecycleEnum, useEnum } from './type';
import { DEFAULT_VUEX_PARAMS } from './constants';
import { getInsertString } from './utils/string';

export interface ConvertedExpression {
  expression: string;
  returnNames?: string[];
  use?: useEnum;
}

export const lifecycleNameMap: Map<Vue2LifecycleEnum, useEnum | undefined> =
  new Map([
    [Vue2LifecycleEnum.BeforeCreate, undefined],
    [Vue2LifecycleEnum.Created, undefined],
    [Vue2LifecycleEnum.BeforeMount, useEnum.OnBeforeMount],
    [Vue2LifecycleEnum.Mounted, useEnum.OnMounted],
    [Vue2LifecycleEnum.BeforeUpdate, useEnum.OnBeforeUpdate],
    [Vue2LifecycleEnum.Updated, useEnum.OnUpdated],
    [Vue2LifecycleEnum.BeforeUnmount, useEnum.OnBeforeUnmount],
    [Vue2LifecycleEnum.BeforeDestroy, useEnum.OnBeforeUnmount],
    [Vue2LifecycleEnum.Destroyed, useEnum.OnUnmounted],
    [Vue2LifecycleEnum.ErrorCaptured, useEnum.OnErrorCaptured],
    [Vue2LifecycleEnum.RenderTracked, useEnum.OnRenderTracked],
    [Vue2LifecycleEnum.RenderTriggered, useEnum.OnRenderTriggered],
    [Vue2LifecycleEnum.Activated, useEnum.OnActivated],
    [Vue2LifecycleEnum.Deactivated, useEnum.OnDeactivated],
  ]);

const contextProps = [
  'attrs',
  'slots',
  'parent',
  'root',
  'listeners',
  'refs',
  'emit',
];

/**
 * @description 将从 this 解构对象中的属性拆分出来
 * @example { a, b } = this => const a = this.a; const b = this.b
 */
const transformDestructFromThis = (source: string) => {
  const sourceFile = ts.createSourceFile('', source, ts.ScriptTarget.Latest);

  function transformer(context: ts.TransformationContext) {
    return (rootNode: ts.SourceFile) => {
      function visit(node: ts.Node): ts.VisitResult<ts.Node> {
        if (ts.isVariableStatement(node)) {
          const { declarations } = node.declarationList;
          for (const declaration of declarations) {
            if (
              ts.isVariableDeclaration(declaration) &&
              ts.isObjectBindingPattern(declaration.name) &&
              declaration?.initializer?.getText(sourceFile) === 'this'
            ) {
              const { elements } = declaration.name;
              const statements = elements.map((element) => {
                if (
                  ts.isBindingElement(element) &&
                  ts.isIdentifier(element.name)
                ) {
                  const name = element.name.text;
                  return ts.createVariableStatement(
                    undefined,
                    ts.createVariableDeclarationList(
                      [
                        ts.createVariableDeclaration(
                          ts.createIdentifier(name),
                          undefined,
                          ts.createPropertyAccess(
                            ts.createThis(),
                            ts.createIdentifier(name)
                          )
                        ),
                      ],
                      ts.NodeFlags.Const
                    )
                  );
                }
                return element;
              });
              return statements;
            }
          }
        }

        return ts.visitEachChild(node, visit, context);
      }

      // 从根节点开始遍历
      return ts.visitNode(rootNode, visit);
    };
  }

  const printer = ts.createPrinter();
  const result = ts.transform(sourceFile, [transformer]);
  const transformedSourceFile = result.transformed[0];

  return printer.printFile(transformedSourceFile);
};

export const replaceThisContext = (
  str: string,
  refNameMap: Map<string, true>
) => {
  return transformDestructFromThis(str)
    .replace(/this\.\$(\w+)/g, (_, p1) => {
      if (contextProps.includes(p1)) return `ctx.${p1}`;
      return `ctx.root.$${p1}`;
    })
    .replace(/this\.([\w-]+)/g, (_, p1) => {
      return refNameMap.has(p1) ? `${p1}.value` : p1;
    });
};

export const getSetupStatements = (
  setupProps: ConvertedExpression[],
  templateContent: string
) => {
  // this.prop => prop.value
  const refNameMap: Map<string, true> = new Map();
  setupProps.forEach(({ use, returnNames }) => {
    if (
      returnNames != null &&
      use != null &&
      /^(toRefs|ref|computed)$/.test(use)
    ) {
      returnNames.forEach((returnName) => {
        refNameMap.set(returnName, true);
      });
    }
  });

  const returnPropsStatement = `return {${setupProps
    .filter((prop) => prop.use !== useEnum.ToRefs) // ignore spread props
    .map(({ returnNames }) => returnNames)
    .filter(Boolean)
    .flat()
    .filter((returnValue) => {
      return templateContent.match(new RegExp(`\\b${returnValue}\\b`));
    })
    .join(',')}}`;

  const statementsExpressions = [
    ...setupProps,
    { expression: returnPropsStatement },
  ]
    .filter(({ expression }) => expression)
    .map(({ expression }) => {
      return {
        expression: replaceThisContext(expression, refNameMap),
      };
    });

  const statements = statementsExpressions
    .map(
      ({ expression }) =>
        ts.createSourceFile('', expression, ts.ScriptTarget.Latest).statements
    )
    .flat();

  return {
    statements,
    statementsExpressions,
  };
};

export const getInitializerProps = (
  node: ts.Node
): ts.ObjectLiteralElementLike[] => {
  if (!ts.isPropertyAssignment(node)) return [];
  if (!ts.isObjectLiteralExpression(node.initializer)) return [];
  return [...node.initializer.properties];
};

export const storePath = `this.$store`;

export const getMethodExpression = ({
  node,
  sourceFile,
  vuexParams = DEFAULT_VUEX_PARAMS,
}: {
  node: ts.Node;
  sourceFile: ts.SourceFile;
  vuexParams?: IVuexParams;
}): ConvertedExpression[] => {
  if (ts.isMethodDeclaration(node)) {
    const async = node.modifiers?.some(
      (mod) => mod.kind === ts.SyntaxKind.AsyncKeyword
    )
      ? 'async'
      : '';

    const name = node.name.getText(sourceFile);
    const type = node.type ? `:${node.type.getText(sourceFile)}` : '';
    const body = node.body?.getText(sourceFile) || '{}';
    const parameters = node.parameters
      .map((param) => param.getText(sourceFile))
      .join(',');
    const fn = `${async}(${parameters})${type} =>${body}`;

    if (lifecycleNameMap.has(name as Vue2LifecycleEnum)) {
      const newLifecycleName = lifecycleNameMap.get(name as Vue2LifecycleEnum);
      const immediate = newLifecycleName == null ? '()' : '';
      return [
        {
          use: newLifecycleName,
          expression: `${newLifecycleName ?? ''}(${fn})${immediate}`,
        },
      ];
    }
    return [
      {
        returnNames: [name],
        expression: `const ${name} = ${fn}`,
      },
    ];
  }
  if (ts.isSpreadAssignment(node)) {
    // mapActions, mapMutations
    if (!ts.isCallExpression(node.expression)) return [];
    const { arguments: args, expression } = node.expression;

    if (!ts.isIdentifier(expression)) return [];
    const mapName = expression.text;
    let [namespace, mapArray] = args;
    // 处理 createNamespacedHelpers 场景
    if (vuexParams.moduleName) {
      mapArray = namespace;
      namespace = ts.factory.createStringLiteral(vuexParams.moduleName);
    }

    if (
      !ts.isStringLiteral(namespace) ||
      !ts.isArrayLiteralExpression(mapArray)
    )
      return [];

    const namespaceText = namespace.getText(sourceFile) || namespace.text;
    const names = mapArray.elements as ts.NodeArray<ts.StringLiteral>;

    if (mapName === vuexParams.mapActions) {
      return names.map(({ text: name }) => {
        return {
          expression: `const ${name} = () => ${storePath}.dispatch(\`${getInsertString(
            namespaceText
          )}/${name}\`)`,
          returnNames: [name],
        };
      });
    }
    if (mapName === vuexParams.mapMutations) {
      return names.map(({ text: name }) => {
        return {
          expression: `const ${name} = () => ${storePath}.commit(\`${getInsertString(
            namespaceText
          )}/${name}\`)`,
          returnNames: [name],
        };
      });
    }
  }
  return [];
};

export const getImportStatement = (setupProps: ConvertedExpression[]) => {
  const usedFunctions = [
    'defineComponent',
    ...new Set(setupProps.map(({ use }) => use).filter(Boolean)),
  ];
  return ts.createSourceFile(
    '',
    `import { ${usedFunctions.join(',')} } from '@vue/composition-api'`,
    ts.ScriptTarget.Latest
  ).statements;
};

export const getExportStatement = ({
  setupProps,
  propNames,
  otherProps,
  templateContent,
}: {
  setupProps: ConvertedExpression[];
  propNames: string[];
  otherProps: ts.ObjectLiteralElementLike[];
  templateContent: string;
}) => {
  const { statements: setupStatements, statementsExpressions } =
    getSetupStatements(setupProps, templateContent);
  const propsArg = [
    propNames.length === 0 ? '_props' : `props`,
    statementsExpressions.some((express) => express.expression.includes('ctx.'))
      ? 'ctx'
      : '_ctx',
  ];
  // 去掉多余的 props
  while (propsArg.length > 0 && propsArg[propsArg.length - 1].startsWith('_')) {
    propsArg.pop();
  }

  const setupArgs = propsArg.map((name) =>
    ts.factory.createParameterDeclaration(undefined, undefined, undefined, name)
  );

  const setupMethod = ts.factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    'setup',
    undefined,
    undefined,
    setupArgs,
    undefined,
    ts.factory.createBlock(setupStatements)
  );

  return ts.factory.createExportAssignment(
    undefined,
    undefined,
    undefined,
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('defineComponent'),
      undefined,
      [ts.factory.createObjectLiteralExpression([...otherProps, setupMethod])]
    )
  );
};
