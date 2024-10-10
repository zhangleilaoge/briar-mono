export enum QueryKeyEnum {
  displayMode = "displayMode",
}

interface IUrlParams {
  [QueryKeyEnum.displayMode]?: "normal" | "full"
}

export const getUrlParams = (url = window.location.href): IUrlParams => {
  const urlObj = new URL(url)
  const urlSearchParams = urlObj.searchParams
  const paramObj = Object.fromEntries(urlSearchParams)
  return paramObj
}

export function updateURLParameter(key: string, value?: string) {
  // 获取当前 URL
  const url = new URL(window.location.href)

  // 更新或添加指定的搜索参数
  if (key && value) {
    url.searchParams.set(key, value)
  } else if (key) {
    url.searchParams.delete(key)
  }

  // 使用 History API 更新浏览器的地址栏，不刷新页面
  window.history.pushState({}, "", url)
}
