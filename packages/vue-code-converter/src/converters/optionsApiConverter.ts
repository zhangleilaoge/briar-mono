import {
  SourceFile,
  factory,
  isExportAssignment,
  createPrinter,
} from "typescript"
import { getExportStatement, getImportStatement } from "../helper"
import { convertOptions } from "./options/optionsConverter"
import { handleVuex } from "../utils/vuex"

export const convertOptionsApi = (
  sourceFile: SourceFile,
  templateContent: string
) => {
  const options = convertOptions(sourceFile, handleVuex(sourceFile))
  if (!options) {
    throw new Error("invalid options.")
  }

  const { setupProps, propNames, otherProps } = options

  const newSrc = factory.createSourceFile(
    [
      ...getImportStatement(setupProps),
      ...sourceFile.statements.filter((state) => !isExportAssignment(state)),
      getExportStatement({
        setupProps,
        propNames,
        otherProps,
        templateContent,
        sourceCode: sourceFile.getText(sourceFile),
      }),
    ],
    sourceFile.endOfFileToken,
    sourceFile.flags
  )
  const printer = createPrinter()
  return printer.printFile(newSrc)
}
