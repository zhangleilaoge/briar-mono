import { notification } from "antd"

export const errorNotify = (error: any) => {
  const [api] = notification.useNotification()

  api.error({
    message: `请求错误`,
    description: error?.message || error?.msg || JSON.stringify(error),
    placement: "top",
  })
}
