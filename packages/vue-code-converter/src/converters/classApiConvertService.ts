import ts from 'typescript';
import {
  ConvertedExpression,
  getExportStatement,
  getImportStatement,
  lifecycleNameMap,
} from '../helper';
import { convertOptions } from './options/optionsConverter';
import { IMethodObj, Vue2LifecycleEnum, useEnum } from '../type';
import {
  parseInjectDecorator,
  parseModelDecorator,
  parsePropDecorator,
  parseProvideDecorator,
} from './class/handlePropertyDeclaration';
import { handleVuex } from '../utils/vuex';
import { normalizeWatchName } from './options/watchConverter';
import { kebabCase } from 'lodash';
import { getNodeByKind, mergeBlockBody } from '../utils/ast';

export default class ConvertClassService {
  // file 源数据
  sourceFile: ts.SourceFile;

  // class 节点数据
  classNode: ts.ClassDeclaration;

  // 标准配置项
  propsMap: Map<string, { use?: string; node: ts.ObjectLiteralExpression }> =
    new Map();

  injectMap: Map<string, { from: string; type?: string; default?: string }> =
    new Map();

  provideMap: Map<string, { from: string; type?: string; value: string }> =
    new Map();

  model: {
    prop: string;
    event: string;
  } | null = null;

  dataMap: Map<string, { type?: string; initializer?: string }> = new Map();

  getterMap: Map<string, { type: string; block: string }> = new Map();

  setterMap: Map<string, { type: string; block: string; parameters: string }> =
    new Map();

  methodsMap: Map<string, IMethodObj> = new Map();

  watchMap: Map<string, { callback: string; options: string }> = new Map();

  lifecycleMap: Map<string, IMethodObj> = new Map();

  templateContent = '';

  // 其他配置项
  otherProps: ts.ObjectLiteralElementLike[] = [];

  constructor(
    classNode: ts.ClassDeclaration,
    sourceFile: ts.SourceFile,
    templateContent: string
  ) {
    this.sourceFile = sourceFile;
    this.classNode = classNode;
    this.templateContent = templateContent;
  }

  convertClass() {
    // 1. 处理 @Component 节点
    const options = convertOptions(
      this.sourceFile,
      handleVuex(this.sourceFile)
    );
    const { setupProps, propNames, otherProps } = options || {
      setupProps: [],
      propNames: [],
      otherProps: [],
    };

    // 2. 处理 class 节点
    this.parseClassNode();

    // 3. setup 节点转化
    setupProps.push(...this.transformToCompositionNode(propNames));

    // 4. 其他节点处理
    const classPropsNode =
      Array.from(this.propsMap.entries()).length > 0
        ? ts.factory.createPropertyAssignment(
            'props',
            ts.factory.createObjectLiteralExpression(
              Array.from(this.propsMap.entries()).map(([key, value]) => {
                const { node } = value;
                return ts.factory.createPropertyAssignment(key, node);
              })
            )
          )
        : undefined;
    const modelNode = this.model
      ? ts.factory.createPropertyAssignment(
          'model',
          ts.factory.createObjectLiteralExpression([
            ts.factory.createPropertyAssignment(
              'event',
              (
                ts.createSourceFile(
                  '',
                  this.model?.event,
                  ts.ScriptTarget.Latest
                ).statements[0] as ts.ExpressionStatement
              ).expression
            ),
            ts.factory.createPropertyAssignment(
              'prop',
              (
                ts.createSourceFile(
                  '',
                  this.model?.prop,
                  ts.ScriptTarget.Latest
                ).statements[0] as ts.ExpressionStatement
              ).expression
            ),
          ])
        )
      : null;
    otherProps.push(...this.otherProps);
    if (classPropsNode) otherProps.push(classPropsNode);
    modelNode && otherProps.push(modelNode);

    // 5. 输出
    const newSrc = ts.factory.createSourceFile(
      [
        ...getImportStatement([
          ...setupProps,
          ...Array.from(this.propsMap.values()).map((prop) => {
            return {
              expression: '',
              use: prop.use as useEnum,
            };
          }),
        ]),
        ...this.sourceFile.statements.filter(
          (state) => !ts.isClassDeclaration(state)
        ),
        getExportStatement({
          setupProps,
          propNames,
          otherProps,
          templateContent: this.templateContent,
        }),
      ],
      this.sourceFile.endOfFileToken,
      this.sourceFile.flags
    );
    const printer = ts.createPrinter();
    return printer.printFile(newSrc);
  }

  transformToCompositionNode(propNames: string[]) {
    const dataProps: ConvertedExpression[] = Array.from(
      this.dataMap.entries()
    ).map(([key, val]) => {
      const { type, initializer } = val;
      return {
        use: useEnum.Ref,
        returnNames: [key],
        expression: `const ${key} = ref${
          type ? `<${type}>` : ''
        }(${initializer})`,
      };
    });

    const computedProps: ConvertedExpression[] = Array.from(
      this.getterMap.entries()
    ).map(([key, val]) => {
      const { type, block } = val;
      if (this.setterMap.has(key)) {
        const setter = this.setterMap.get(key)!;

        return {
          use: useEnum.Computed,
          expression: `const ${key} = computed({
              get()${type} ${block},
              set(${setter.parameters}) ${setter.block}
            })`,
          returnNames: [key],
        };
      }
      return {
        use: useEnum.Computed,
        expression: `const ${key} = computed(()${type} => ${block})`,
        returnNames: [key],
      };
    });

    const methodsProps: ConvertedExpression[] = Array.from(
      this.methodsMap.entries()
    ).map(([key, val]) => {
      const { async, type, body, parameters } = val;
      return {
        expression: `const ${key} = ${async}(${parameters})${type} => ${body}`,
        returnNames: [key],
      };
    });

    const watchProps: ConvertedExpression[] = Array.from(
      this.watchMap.entries()
    ).map(([key, val]) => {
      const { callback, options } = val;
      return {
        use: useEnum.Watch,
        expression: `watch(${[normalizeWatchName(key), callback, options]
          .filter((item) => item != null)
          .join(',')})`,
      };
    });

    const lifecycleProps: ConvertedExpression[] = Array.from(
      this.lifecycleMap.entries()
    ).map(([key, val]) => {
      const newLifecycleName = lifecycleNameMap.get(key as Vue2LifecycleEnum);
      const { async, body, parameters, type } = val;

      const fn = `${async}(${parameters})${type} =>${body}`;
      const immediate = newLifecycleName == null ? '()' : '';

      return {
        use: newLifecycleName,
        expression: `${newLifecycleName ?? ''}(${fn})${immediate}`,
      };
    });

    propNames.push(...Array.from(this.propsMap.keys()));

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

    const injectProps: ConvertedExpression[] = Array.from(
      this.injectMap.entries()
    ).map(([key, val]) => {
      const { from, type, default: _default } = val;

      return {
        use: useEnum.Inject,
        expression: `const ${key} = inject${type ? `<${type}>` : ''}(${from})${
          _default ? ` || (${_default})` : ''
        }`,
        returnNames: [key],
      };
    });

    const provideProps: ConvertedExpression[] = Array.from(
      this.provideMap.entries()
    ).map(([_, val]) => {
      return {
        use: useEnum.Provide,
        expression: `provide(${val.from}, ${val.value})`,
      };
    });

    return [
      ...injectProps,
      ...propsRefProps,
      ...dataProps,
      ...computedProps,
      ...methodsProps,
      ...watchProps,
      ...lifecycleProps,
      ...provideProps,
    ];
  }

  parseClassNode() {
    this.classNode.members.forEach((member) => {
      if (ts.isGetAccessor(member)) {
        this.parseGet(member);
      }
      if (ts.isSetAccessor(member)) {
        this.parseSet(member);
      }
      if (ts.isMethodDeclaration(member)) {
        this.parseMethod(member);
      }
      if (ts.isPropertyDeclaration(member)) {
        this.parseProperty(member);
      }
    });
  }

  parseGet(member: ts.GetAccessorDeclaration) {
    const { name: propName, body, type: typeName } = member;
    const type = typeName ? `:${typeName.getText(this.sourceFile)}` : '';
    const block = body?.getText(this.sourceFile) || '{}';
    const name = propName.getText(this.sourceFile);

    this.getterMap.set(name, {
      type,
      block,
    });
  }

  parseSet(member: ts.SetAccessorDeclaration) {
    const { name: propName, body, type: typeName } = member;
    const type = typeName ? `:${typeName.getText(this.sourceFile)}` : '';
    const block = body?.getText(this.sourceFile) || '{}';
    const name = propName.getText(this.sourceFile);
    const parameters = member.parameters
      .map((param) => param.getText(this.sourceFile))
      .join(',');

    this.setterMap.set(name, {
      parameters,
      type,
      block,
    });
  }

  parseMethod(member: ts.MethodDeclaration) {
    const { decorators } = member;
    const name = member.name.getText(this.sourceFile);

    if (/^(render|data|beforeRouteLeave|beforeRouteUpdate)$/.test(name)) {
      this.otherProps.push(member);
      return;
    }

    const async: 'async' | '' = member.modifiers?.some(
      (mod) => mod.kind === ts.SyntaxKind.AsyncKeyword
    )
      ? 'async'
      : '';

    const type = member.type ? `:${member.type.getText(this.sourceFile)}` : '';
    const body = member.body?.getText(this.sourceFile) || '{}';
    const parameters = member.parameters
      .map((param) => param.getText(this.sourceFile))
      .join(',');

    const obj = {
      async,
      type,
      body,
      parameters,
    };

    if (lifecycleNameMap.has(name as Vue2LifecycleEnum)) {
      this.lifecycleMap.set(name, obj);
    } else {
      this.methodsMap.set(name, obj);
    }

    if (decorators) {
      decorators.forEach((dec) => {
        const decorator = this.getDecoratorParams(dec);
        if (decorator && decorator.decoratorName === 'Watch') {
          const [target, options] = decorator.args;
          // 此处的 callback 不传函数体，而传函数名。对应函数交由 methodsMap 处理。
          this.watchMap.set(target, { callback: name, options });
        }

        if (decorator && decorator.decoratorName === 'Emit') {
          const fnBody = this.parseEmitFnBody({
            name,
            fnBody: obj.body,
            member,
            decorator,
          });

          if (fnBody) {
            const method = this.methodsMap.get(name)!;
            // @Emit 场景，在函数体尾部追加 emit 语句
            this.methodsMap.set(name, {
              ...method,
              body: mergeBlockBody(method.body, fnBody, /\breturn\b/),
            });
          }
        }
      });
    }
  }

  // inject provide prop model
  parseProperty(member: ts.PropertyDeclaration) {
    const name = member.name.getText(this.sourceFile);
    const type = member.type?.getText(this.sourceFile);
    const { decorators } = member;

    if (decorators) {
      const propNode = parsePropDecorator({
        decorator: decorators[0],
        sourceFile: this.sourceFile,
        tsType: type,
      });
      if (propNode) {
        this.propsMap.set(name, propNode);
        return;
      }

      const injectNode = parseInjectDecorator(
        decorators[0],
        this.sourceFile,
        type
      );
      if (injectNode) {
        this.injectMap.set(name, { from: `'${name}'`, ...injectNode });
        return;
      }

      const provideNode = parseProvideDecorator(
        decorators[0],
        this.sourceFile,
        type
      );
      if (provideNode) {
        this.provideMap.set(name, {
          from: `'${name}'`,
          value: member.initializer?.getText(this.sourceFile) || 'undefined',
          ...provideNode,
        });
      }

      // @Model 比较特殊，是 prop + model + get + set 的语法糖集合
      const { propNode: _propNode, modelNode } =
        parseModelDecorator(decorators[0], this.sourceFile, type) || {};
      const propName = modelNode?.prop?.replace(/['"]/g, '') || name;
      const propNameString = `'${propName}'`;
      if (_propNode) {
        this.propsMap.set(propName, _propNode);
      }
      if (modelNode) {
        this.model = {
          ...this.model,
          ...modelNode,
          prop: propNameString,
        };
        this.getterMap.set(name, {
          type: '',
          block: `{return this.${propName}}`,
        });
        this.setterMap.set(name, {
          parameters: 'value',
          type: '',
          block: `{this.$emit(${modelNode.event}, value)}`,
        });
      }

      return;
    }
    const initializer = member.initializer?.getText(this.sourceFile);
    this.dataMap.set(name, {
      type,
      initializer,
    });
  }

  /** 处理 @Emit 方法，返回仅包含 emit 语句的函数体 */
  parseEmitFnBody({
    name,
    decorator,
    member,
    fnBody,
  }: {
    name: string;
    decorator: {
      decoratorName: string;
      args: string[];
    };
    member: ts.MethodDeclaration;
    fnBody: string;
  }) {
    const [eventName = kebabCase(name)] = decorator!.args;
    const bodySource = ts.createSourceFile('', fnBody, ts.ScriptTarget.Latest);
    const bodyBlock = getNodeByKind(
      bodySource,
      ts.SyntaxKind.Block
    ) as ts.Block;

    const returnStatement = bodyBlock.statements.find(
      (statement) => statement.kind === ts.SyntaxKind.ReturnStatement
    );
    const returnValue = returnStatement
      ?.getText(bodySource)
      .replace(/\breturn\b/, '')
      .replace(/[\s;]/g, '');
    const newStatement = ts.factory.createExpressionStatement(
      ts.factory.createCallExpression(
        ts.factory.createIdentifier('this.$emit'),
        undefined,
        [
          ts.factory.createStringLiteral(`${eventName}`),
          ...[
            returnValue || '',
            ...member.parameters.map((param) =>
              param.name.getText(this.sourceFile)
            ),
          ]
            .filter(Boolean)
            .map((item) => {
              return ts.factory.createIdentifier(item);
            }),
        ]
      )
    );
    const newBlock = ts.factory.updateBlock(
      bodyBlock,
      ts.factory.createNodeArray([newStatement])
    );
    const newBodySource = ts.factory.updateSourceFile(bodySource, [
      ...bodySource.statements.map((statement) => {
        if (statement === bodyBlock) {
          return newBlock;
        }
        return statement;
      }),
    ]);

    const printer = ts.createPrinter();
    const resultCode = printer.printFile(newBodySource);

    return resultCode;
  }

  /** @description 处理装饰器参数 */
  getDecoratorParams(decorator: ts.Decorator) {
    // @Prop, @Watch
    if (!ts.isCallExpression(decorator.expression)) return null;

    const callExpression = decorator.expression;
    const decoratorName = callExpression.expression.getText(this.sourceFile);
    const args = callExpression.arguments.map((arg) => {
      if (ts.isStringLiteral(arg)) {
        return arg.text;
      }
      return arg.getText(this.sourceFile);
    });

    return {
      decoratorName,
      args,
    };
  }
}
