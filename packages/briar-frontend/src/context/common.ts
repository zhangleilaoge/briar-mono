import React from "react"

// 创建一个新的 Context
const CommonContext = React.createContext({
  hrefHistory: [] as string[],
  fullScreen: false,
  SiderClass: "",
  LayoutClass: "",
})

export default CommonContext
