/**
 * @description 获取插入模版字符串的插入值
 * @example
 * getInsertString('variable') = '${variable}'
 * getInsertString("'variable'") = 'variable'
 */
export const getInsertString = (input: string) => {
  if (input[0] === "'" || input[0] === '"') {
    return input.replace(/['"]/g, '');
  }

  return `\${${input}}`;
};
