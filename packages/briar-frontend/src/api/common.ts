import { createAlova } from "alova"
import fetchAdapter from "alova/fetch"

const alovaInstance = createAlova({
  requestAdapter: fetchAdapter(),
  baseURL: "http://122.51.158.41/api",
})

export default alovaInstance
