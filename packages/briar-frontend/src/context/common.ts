import React from "react"

// 创建一个新的 Context
const CommonContext = React.createContext({
  pathHistory: [] as string[],
})

export default CommonContext
