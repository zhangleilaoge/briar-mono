import ts from 'typescript';
import {
  ConvertedExpression,
  getInitializerProps,
  storePath,
} from '../../helper';
import { IVuexParams, useEnum } from '../../type';
import { DEFAULT_VUEX_PARAMS } from '../../constants';
import { getInsertString } from '../../utils/string';

export const computedConverter = ({
  node,
  sourceFile,
  vuexParams = DEFAULT_VUEX_PARAMS,
}: {
  node: ts.Node;
  sourceFile: ts.SourceFile;
  vuexParams?: IVuexParams;
}): ConvertedExpression[] => {
  return getInitializerProps(node)
    .map((prop) => {
      // mapGetters, mapState
      if (ts.isSpreadAssignment(prop)) {
        if (!ts.isCallExpression(prop.expression)) return;
        const { arguments: args, expression } = prop.expression;

        if (!ts.isIdentifier(expression)) return;
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
          return;

        const namespaceText = namespace.getText(sourceFile) || namespace.text;
        const names = mapArray.elements as ts.NodeArray<ts.StringLiteral>;

        switch (mapName) {
          case vuexParams.mapState:
            return names.map(({ text: name }) => {
              return {
                use: useEnum.Computed,
                expression: `const ${name} = computed(() => ${storePath}.state[\`${getInsertString(
                  namespaceText
                )}\`].${name})`,
                returnNames: [name],
              };
            });
          case vuexParams.mapGetters:
            return names.map(({ text: name }) => {
              return {
                use: useEnum.Computed,
                expression: `const ${name} = computed(() => ${storePath}.getters[\`${getInsertString(
                  namespaceText
                )}/${name}\`])`,
                returnNames: [name],
              };
            });
        }
        return null;
      }
      if (ts.isMethodDeclaration(prop)) {
        // computed method
        const { name: propName, body, type } = prop;
        const typeName = type ? `:${type.getText(sourceFile)}` : '';
        const block = body?.getText(sourceFile) || '{}';
        const name = propName.getText(sourceFile);

        return {
          use: useEnum.Computed,
          expression: `const ${name} = computed(()${typeName} => ${block})`,
          returnNames: [name],
        };
      }
      if (ts.isPropertyAssignment(prop)) {
        // computed getter/setter
        if (!ts.isObjectLiteralExpression(prop.initializer)) return;

        const name = prop.name.getText(sourceFile);
        const block = prop.initializer.getText(sourceFile) || '{}';

        return {
          use: useEnum.Computed,
          expression: `const ${name} = computed(${block})`,
          returnNames: [name],
        };
      }
      return null;
    })
    .flat()
    .filter(Boolean) as ConvertedExpression[];
};
