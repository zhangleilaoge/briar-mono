import React from "react"

// 创建一个新的 Context
const CommonContext = React.createContext({
  /** 全屏 */
  fullScreen: false,
  SiderClass: "",
  LayoutClass: "",
  inFullScreen: () => {},
  outFullScreen: () => {},

  /** 用户 */
  profileImg: "",
  fullName: "",
})

export default CommonContext
