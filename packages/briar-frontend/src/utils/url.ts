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
