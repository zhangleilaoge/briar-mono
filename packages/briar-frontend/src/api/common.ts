import { isDev } from "@/constants/env"
import { createAlova } from "alova"
import fetchAdapter from "alova/fetch"
import reactHook from "alova/react"

const alovaInstance = createAlova({
  requestAdapter: fetchAdapter(),
  baseURL: isDev
    ? "http://127.0.0.1:8922/api"
    : "http://restrained-hunter.website/api",
  statesHook: reactHook,
  responded: (response) => response.json(),
  timeout: 10000,
})

export default alovaInstance