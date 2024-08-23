import { createAlova } from "alova"
import fetchAdapter from "alova/fetch"
import reactHook from "alova/react"

const alovaInstance = createAlova({
  requestAdapter: fetchAdapter(),
  baseURL: "http://restrained-hunter.website/api",
  statesHook: reactHook,
  responded: (response) => response?.json?.() || response,
  timeout: 20000,
})

export const getQueryFromObj = (obj: any) => {
  if (!obj) return ""
  return Object.keys(obj)
    .map((key) => `${key}=${encodeURIComponent(obj[key])}`)
    .join("&")
}

export default alovaInstance
