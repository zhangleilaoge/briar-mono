import ts from 'typescript';
import {
  ConvertedExpression,
  getInitializerProps,
  getMethodExpression,
} from '../../helper';
import { DEFAULT_VUEX_PARAMS } from '../../constants';
import { IVuexParams } from '../../type';

export const methodsConverter = ({
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
      return getMethodExpression({ node: prop, sourceFile, vuexParams });
    })
    .flat();
};
