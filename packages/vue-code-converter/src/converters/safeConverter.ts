import { IncompatibleSyntax, useEnum } from '../type';
import ts from 'typescript';
import { INCOMPATIBLE_SYNTAX_PLACEHOLDERS } from '../constants';

/** @description 处理不兼容的语法 */
export const handleIncompatibleSyntax = (scriptContent: string) => {
  const sourceFile = ts.createSourceFile(
    '',
    scriptContent,
    ts.ScriptTarget.Latest
  );
  let warning = '';

  // handle import
  const importStatements = sourceFile.statements
    .filter((state) => ts.isImportDeclaration(state))
    .map((_state) => {
      const state = _state as ts.ImportDeclaration;
      const importFrom = state.moduleSpecifier
        .getText(sourceFile)
        .replace(/['"]/g, '') as IncompatibleSyntax;
      if (
        [
          IncompatibleSyntax.VuexModuleDecorators,
          IncompatibleSyntax.VuexClass,
        ].includes(importFrom)
      ) {
        warning += `${importFrom} is not supported in composition-api. `;
        return ts.factory.updateImportDeclaration(
          state,
          state.decorators,
          state.modifiers,
          state.importClause,
          ts.createLiteral(INCOMPATIBLE_SYNTAX_PLACEHOLDERS[importFrom]),
          state.assertClause
        );
      }

      return state;
    });

  // handle property
  const incompatibleSyntaxTransformer =
    (context: ts.TransformationContext) => (rootNode: ts.SourceFile) => {
      function visit(node: ts.Node): ts.Node {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'defineComponent' &&
          node.arguments.length > 0 &&
          ts.isObjectLiteralExpression(node.arguments[0])
        ) {
          const componentObject = node
            .arguments[0] as ts.ObjectLiteralExpression;
          const updatedProperties = componentObject.properties.map((prop) => {
            if (
              ts.isPropertyAssignment(prop) &&
              ts.isIdentifier(prop.name) &&
              [IncompatibleSyntax.Extends, IncompatibleSyntax.Mixins].includes(
                prop.name.text as IncompatibleSyntax
              )
            ) {
              warning += `${prop.name.text} is not supported in composition-api. `;
              return ts.updatePropertyAssignment(
                prop,
                prop.name,
                ts.createIdentifier(
                  INCOMPATIBLE_SYNTAX_PLACEHOLDERS[
                    prop.name.text as IncompatibleSyntax
                  ]
                )
              );
            }
            return prop;
          });

          const updatedComponentObject = ts.updateObjectLiteral(
            componentObject,
            updatedProperties
          );

          return ts.updateCall(node, node.expression, node.typeArguments, [
            updatedComponentObject,
          ]);
        }
        return ts.visitEachChild(node, visit, context);
      }
      return ts.visitNode(rootNode, visit);
    };
  const sourceWithoutIncompatibleSyntax = ts.transform(sourceFile, [
    incompatibleSyntaxTransformer,
  ]).transformed[0];

  const newSrc = ts.factory.createSourceFile(
    [
      ...importStatements,
      ...sourceWithoutIncompatibleSyntax.statements.filter(
        (state) => !ts.isImportDeclaration(state)
      ),
    ],
    sourceFile.endOfFileToken,
    sourceFile.flags
  );
  const printer = ts.createPrinter();

  return {
    output: printer.printFile(newSrc),
    warning,
  };
};

/** @description 处理同名变量 */
export const handleSameNameVar = (scriptContent: string, warning = '') => {
  const sourceFile = ts.createSourceFile(
    '',
    scriptContent,
    ts.ScriptTarget.Latest
  );

  const refVariables: string[] = [];
  const methodNames: string[] = [];

  // 获取 setup 内部所有响应式变量名和方法
  const visitToFindRefVar = (node: ts.Node) => {
    if (
      ts.isMethodDeclaration(node) &&
      node.name &&
      node.name.getText(sourceFile) === 'setup'
    ) {
      node.forEachChild((child) => {
        if (ts.isBlock(child)) {
          child.forEachChild((blockChild) => {
            if (ts.isVariableStatement(blockChild)) {
              blockChild.declarationList.declarations.forEach((declaration) => {
                if (
                  ts.isVariableDeclaration(declaration) &&
                  declaration.initializer
                ) {
                  if (
                    ts.isCallExpression(declaration.initializer) &&
                    [useEnum.Ref, useEnum.ToRefs, useEnum.Computed].includes(
                      declaration.initializer.expression.getText(
                        sourceFile
                      ) as useEnum
                    )
                  ) {
                    refVariables.push(
                      ...declaration.name
                        .getText(sourceFile)
                        .replace(/[{}]/g, '')
                        .split(',')
                        .map((item) => item.trim())
                    );
                  } else if (ts.isArrowFunction(declaration.initializer)) {
                    methodNames.push(declaration.name.getText(sourceFile));
                  }
                }
              });
            }
          });
        }
      });
    }
    ts.forEachChild(node, visitToFindRefVar);
  };

  const checkNameRepeat = (nameToCheck: string) => {
    if (refVariables.includes(nameToCheck)) {
      warning += `Duplicate variable declaration found: ${nameToCheck}. `;

      return true;
    }
    if (methodNames.includes(nameToCheck)) {
      warning += `Duplicate method declaration found: ${nameToCheck}. `;

      return true;
    }

    return false;
  };

  // 将与响应式变量或方法同名的其他变量声明做名称替换
  const transformer = <T extends ts.Node>(
    context: ts.TransformationContext
  ) => {
    return (rootNode: T) => {
      function visit(node: ts.Node): ts.Node {
        // 1. 处理重复命名的 importName
        if (ts.isImportClause(node)) {
          let newName;
          // case1.1: import a from 'b';
          if (node.name) {
            let newNameStr;

            if (checkNameRepeat(node.name.getText(sourceFile))) {
              newNameStr =
                INCOMPATIBLE_SYNTAX_PLACEHOLDERS[IncompatibleSyntax.SameName];
            } else {
              newNameStr = node.name.getText(sourceFile);
            }

            newName = newNameStr
              ? ts.factory.createIdentifier(newNameStr)
              : undefined;
          }

          let newNamedBindings;
          // @ts-ignore case1.2: import { a, c as d } from 'b';
          if (node?.namedBindings?.elements) {
            newNamedBindings = ts.factory.createNamedImports(
              // @ts-ignore
              node.namedBindings.elements?.map((ele: ts.ExportSpecifier) => {
                const { name, propertyName } = ele;
                let newName = name;
                if (checkNameRepeat(name.getText(sourceFile))) {
                  newName = ts.factory.createIdentifier(
                    INCOMPATIBLE_SYNTAX_PLACEHOLDERS[
                      IncompatibleSyntax.SameName
                    ]
                  );
                }

                return ts.factory.createImportSpecifier(
                  false,
                  propertyName,
                  newName
                );
              }) || []
            );
            // @ts-ignore case1.3: import * as c from 'b';
          } else if (node?.namedBindings?.name) {
            newNamedBindings = ts.factory.createNamespaceImport(
              ts.factory.createIdentifier(
                // @ts-ignore
                checkNameRepeat(node.namedBindings.name.getText(sourceFile))
                  ? INCOMPATIBLE_SYNTAX_PLACEHOLDERS[
                      IncompatibleSyntax.SameName
                    ]
                  : // @ts-ignore
                    node.namedBindings.name.getText(sourceFile)
              )
            );
          }
          return ts.factory.updateImportClause(
            node,
            false,
            newName,
            newNamedBindings
          );
        }

        // 2. 处理重复命名的声明
        if (
          ts.isVariableDeclaration(node) &&
          refVariables.includes(node.name.getText(sourceFile))
        ) {
          // 如果是响应式声明的，保持不变
          if (
            ts.isCallExpression(node.initializer!) &&
            [useEnum.Ref, useEnum.ToRefs, useEnum.Computed].includes(
              node.initializer.expression.getText(sourceFile) as useEnum
            )
          ) {
            return node;
          }
          warning += `Duplicate variable declaration found: ${node.name.getText(
            sourceFile
          )}. `;
          return ts.factory.updateVariableDeclaration(
            node,
            ts.createIdentifier(
              INCOMPATIBLE_SYNTAX_PLACEHOLDERS[IncompatibleSyntax.SameName]
            ),
            node.exclamationToken,
            node.type,
            node.initializer
          );
        }

        // 3. 处理重复命名的声明(解构赋值形式)
        if (
          ts.isVariableDeclaration(node) &&
          ts.isObjectBindingPattern(node.name)
        ) {
          // 如果是响应式声明的，保持不变
          if (
            ts.isCallExpression(node.initializer!) &&
            [useEnum.Ref, useEnum.ToRefs, useEnum.Computed].includes(
              node.initializer.expression.getText(sourceFile) as useEnum
            )
          ) {
            return node;
          }
          return ts.factory.updateVariableDeclaration(
            node,
            ts.factory.createObjectBindingPattern([
              ...node.name.elements.map((element) => {
                if (refVariables.includes(element.name.getText(sourceFile))) {
                  warning += `Duplicate variable declaration found: ${element.name.getText(
                    sourceFile
                  )}. `;

                  return ts.factory.createBindingElement(
                    undefined,
                    undefined,
                    INCOMPATIBLE_SYNTAX_PLACEHOLDERS[
                      IncompatibleSyntax.SameName
                    ],
                    undefined
                  );
                }
                return element;
              }),
            ]),
            node.exclamationToken,
            node.type,
            node.initializer
          );
        }

        return ts.visitEachChild(node, visit, context);
      }

      return ts.visitNode(rootNode, visit);
    };
  };

  visitToFindRefVar(sourceFile);

  const result = ts.transform(sourceFile, [transformer]);
  const printer = ts.createPrinter();
  const transformedSourceFile = result.transformed[0] as ts.SourceFile;

  return {
    output: printer.printFile(transformedSourceFile),
    warning,
  };
};
