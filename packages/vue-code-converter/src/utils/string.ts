/**
 * @description 获取插入模版字符串的插入值
 * @example
 * getInsertString('variable') = '${variable}'
 * getInsertString("'variable'") = 'variable'
 */
export const getInsertString = (input: string) => {
  if (input[0] === "'" || input[0] === '"') {
    return input.replace(/['"]/g, "")
  }

  return `\${${input}}`
}

/** @description 去掉 js 注释 */
export const removeScriptComments = (input: string) => {
  const LINE_BREAK = "\n\n"

  // 去除注释的正则表达式
  const commentRegex = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm

  // 删除注释代码和空格代码，但保留行末空格
  const strippedCode = input.replace(commentRegex, (match) => {
    // 如果是单行注释，则返回一个空行间隙（即在行末加上两个换行符）
    if (match.startsWith("//")) {
      return LINE_BREAK
    }
    // 如果是多行注释，则保留与其同样长度的空白字符，并返回一个空行间隙
    else {
      return (
        match
          .split("")
          .map((char) => {
            return /\s/.test(char) ? char : " "
          })
          .join("") + LINE_BREAK
      )
    }
  })

  return strippedCode
}

/** @description 去掉 vue 模板中的注释 */
export function removeVueTemplateComments(template: string): string {
  // 正则表达式匹配 Vue 模板中的注释 <!-- ... -->
  const regex = /<!--[\s\S]*?-->/g
  return template.replace(regex, "").trim()
}

/** @description 替换代码中的变量，但不处理字符串字面量 */
export function replaceVariableInCode(
  code: string,
  oldVar: string,
  newVar: string
): string {
  const regex = new RegExp(`\\b${oldVar}\\b`, "g")

  // 回调函数用于逐个替换匹配到的变量
  return code.replace(regex, (match, offset, originalString) => {
    // 在匹配的代码段中查找字符串字面量
    const before = originalString.slice(0, offset)
    const after = originalString.slice(offset + match.length)

    // 检查 before 部分是否存在未关闭的引号
    const inStringLiteralBefore =
      before.match(/(['"]).*$/)?.[1] && !before.match(/(['"]).*['"]/)

    // 检查 after 部分是否存在关闭的引号
    const inStringLiteralAfter =
      after.match(/^.*(['"])/)?.[1] && !after.match(/['"].*$/)

    // 只有在未处于字符串字面量的情况下，才进行替换
    if (!inStringLiteralBefore && !inStringLiteralAfter) {
      return newVar
    }

    return match // 如果在字符串字面量中，不进行替换
  })
}
