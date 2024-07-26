import ts from 'typescript';
import { SFCBlock, parseComponent } from 'vue-template-compiler';
import ConvertClassService from './converters/classApiConvertService';
import { convertOptionsApi } from './converters/optionsApiConverter';
import { getNodeByKind } from './utils/ast';
import { IConvertOptions, IConvertResult, InputType } from './type';
import {
  handleIncompatibleSyntax,
  handleSameNameVar,
} from './converters/safeConverter';
import prettier, { Options } from 'prettier';
import { DEFAULT_PRETTIER_OPTIONS } from './constants';
import { getCompleteContent } from './utils/jsx';

const checkNeedConvert = (input: string) => {
  if (input.includes('composition-api') && input.includes('setup')) {
    return false;
  }

  return true;
};

export const convertSrc = (input: string): IConvertResult => {
  if (!checkNeedConvert(input)) {
    return {
      output: input,
      inputType: InputType.CompositionApi,
    };
  }

  const parsed = parseComponent(input);
  const { script, styles, template } = parsed;
  const scriptContent = script?.content || '';

  const sourceFile = ts.createSourceFile(
    '',
    scriptContent,
    ts.ScriptTarget.Latest
  );

  // optionsAPI
  const exportAssignNode = getNodeByKind(
    sourceFile,
    ts.SyntaxKind.ExportAssignment
  );
  if (exportAssignNode) {
    return {
      output: getCompleteContent(
        template,
        {
          ...script,
          content: convertOptionsApi(sourceFile, template?.content || ''),
        } as SFCBlock,
        styles?.[0]
      ),
      inputType: InputType.OptionStyle,
    };
  }

  // classAPI
  const classNode = getNodeByKind<ts.ClassDeclaration>(
    sourceFile,
    ts.SyntaxKind.ClassDeclaration
  );
  if (classNode) {
    return {
      output: getCompleteContent(
        template,
        {
          ...script,
          content: new ConvertClassService(
            classNode,
            sourceFile,
            template?.content || ''
          ).convertClass(),
        } as SFCBlock,
        styles?.[0]
      ),
      inputType: InputType.DecorateStyle,
    };
  }

  throw new Error('no convert target.');
};

export const safeConvert = (result: IConvertResult): IConvertResult => {
  const { output, inputType } = result;
  const parsed = parseComponent(output);
  const { script, styles, template } = parsed;
  const scriptContent = script?.content || '';

  // 处理不兼容的语法
  const { warning, output: handledIncompatibleSyntaxScript } =
    handleIncompatibleSyntax(scriptContent);

  // 处理重名变量
  const { output: handledSameNameScript, warning: handledSameNameWarning } =
    handleSameNameVar(handledIncompatibleSyntaxScript, warning);

  return {
    output: getCompleteContent(
      template,
      { ...script, content: handledSameNameScript } as SFCBlock,
      styles?.[0]
    ),
    inputType,
    warning: handledSameNameWarning,
  };
};

export const prettierConvert = (
  result: IConvertResult,
  prettierOptions: Partial<Options> = DEFAULT_PRETTIER_OPTIONS
): IConvertResult => {
  const { output } = result;
  const formattedOutput = prettier.format(output, {
    ...DEFAULT_PRETTIER_OPTIONS,
    ...prettierOptions,
  });

  return {
    ...result,
    output: formattedOutput,
  };
};

export const convert = (
  input: string,
  option?: IConvertOptions
): IConvertResult => {
  let result = convertSrc(input);

  if (option?.strict && result.inputType !== InputType.CompositionApi) {
    result = safeConvert(result);
  }

  if (result.inputType !== InputType.CompositionApi) {
    result = prettierConvert(result, option?.prettier);
  }

  return result;
};
