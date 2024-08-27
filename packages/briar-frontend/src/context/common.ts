import React from "react"

// 创建一个新的 Context
const CommonContext = React.createContext({
  fullScreen: false,
  SiderClass: "",
  LayoutClass: "",
  inFullScreen: () => {},
  outFullScreen: () => {},
})

export default CommonContext
