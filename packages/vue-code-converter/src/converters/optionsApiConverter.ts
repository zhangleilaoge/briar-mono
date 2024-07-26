import ts from 'typescript';
import { getExportStatement, getImportStatement } from '../helper';
import { convertOptions } from './options/optionsConverter';
import { handleVuex } from '../utils/vuex';

export const convertOptionsApi = (
  sourceFile: ts.SourceFile,
  templateContent: string
) => {
  const options = convertOptions(sourceFile, handleVuex(sourceFile));
  if (!options) {
    throw new Error('invalid options.');
  }

  const { setupProps, propNames, otherProps } = options;

  const newSrc = ts.factory.createSourceFile(
    [
      ...getImportStatement(setupProps),
      ...sourceFile.statements.filter((state) => !ts.isExportAssignment(state)),
      getExportStatement({
        setupProps,
        propNames,
        otherProps,
        templateContent,
      }),
    ],
    sourceFile.endOfFileToken,
    sourceFile.flags
  );
  const printer = ts.createPrinter();
  return printer.printFile(newSrc);
};
